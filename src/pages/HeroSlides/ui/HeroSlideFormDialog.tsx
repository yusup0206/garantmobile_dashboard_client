import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import type { HeroSlide, HeroSlideInput } from "@/services/heroSlides/heroSlides.types";

type HeroSlideFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide?: HeroSlide | null;
  onSubmit: (values: HeroSlideInput) => void;
  pending?: boolean;
};

const EMPTY: HeroSlideInput = {
  tag: { ru: "", tm: "" },
  title: { ru: "", tm: "" },
  subtitle: { ru: "", tm: "" },
  price: null,
  old: null,
  img: "",
  href: "",
  accent: "#1B23D8",
  productId: null,
  sortOrder: 0,
  active: true,
};

/** "" ↔ null для числовых полей. */
const numOrNull = (v: string): number | null => (v === "" ? null : Number(v));

export function HeroSlideFormDialog({
  open,
  onOpenChange,
  slide,
  onSubmit,
  pending,
}: HeroSlideFormDialogProps) {
  const t = useT();
  const [draft, setDraft] = useState<HeroSlideInput>(EMPTY);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitleError(false);
    if (slide) {
      const { id: _id, ...rest } = slide;
      void _id;
      setDraft({
        ...rest,
        tag: { ...slide.tag },
        title: { ...slide.title },
        subtitle: { ...slide.subtitle },
      });
    } else {
      setDraft(EMPTY);
    }
  }, [open, slide]);

  function setLoc(field: "tag" | "title" | "subtitle", lang: "ru" | "tm", value: string) {
    setDraft((d) => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  }

  function submit() {
    if (!draft.title.ru.trim()) {
      setTitleError(true);
      return;
    }
    onSubmit(draft);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {slide ? t("hero.dialog.edit") : t("hero.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("hero.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <Field label={t("hero.form.img")}>
            <ImageUploadField
              value={draft.img}
              onChange={(url) => setDraft((d) => ({ ...d, img: url }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={t("hero.form.titleRu")}
              error={titleError ? t("err.heroTitleRequired") : undefined}
            >
              <Input
                value={draft.title.ru}
                invalid={titleError}
                onChange={(e) => setLoc("title", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("hero.form.titleTm")}>
              <Input
                value={draft.title.tm}
                onChange={(e) => setLoc("title", "tm", e.target.value)}
              />
            </Field>
            <Field label={t("hero.form.tagRu")}>
              <Input
                value={draft.tag.ru}
                onChange={(e) => setLoc("tag", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("hero.form.tagTm")}>
              <Input
                value={draft.tag.tm}
                onChange={(e) => setLoc("tag", "tm", e.target.value)}
              />
            </Field>
          </div>

          <Field label={t("hero.form.subtitleRu")}>
            <Input
              value={draft.subtitle.ru}
              onChange={(e) => setLoc("subtitle", "ru", e.target.value)}
            />
          </Field>
          <Field label={t("hero.form.subtitleTm")}>
            <Input
              value={draft.subtitle.tm}
              onChange={(e) => setLoc("subtitle", "tm", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("hero.form.price")}>
              <Input
                type="number"
                min={0}
                value={draft.price ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, price: numOrNull(e.target.value) }))
                }
              />
            </Field>
            <Field label={t("hero.form.old")}>
              <Input
                type="number"
                min={0}
                value={draft.old ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, old: numOrNull(e.target.value) }))
                }
              />
            </Field>
            <Field label={t("hero.form.productId")}>
              <Input
                type="number"
                min={1}
                value={draft.productId ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, productId: numOrNull(e.target.value) }))
                }
              />
            </Field>
            <Field label={t("hero.form.href")}>
              <Input
                value={draft.href}
                onChange={(e) => setDraft((d) => ({ ...d, href: e.target.value }))}
                placeholder="/product/1"
              />
            </Field>
            <Field label={t("hero.form.accent")}>
              <input
                type="color"
                value={draft.accent || "#1B23D8"}
                onChange={(e) => setDraft((d) => ({ ...d, accent: e.target.value }))}
                className="h-12 w-full rounded-xl border border-line bg-canvas"
              />
            </Field>
            <Field label={t("hero.form.order")}>
              <Input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))
                }
              />
            </Field>
          </div>

          <label className="mt-1 flex items-center gap-2.5 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft((d) => ({ ...d, active: e.target.checked }))}
              className="h-4 w-4 rounded border-line accent-brand"
            />
            {t("hero.form.active")}
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : slide ? t("common.save") : t("common.add")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-ink/70">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
