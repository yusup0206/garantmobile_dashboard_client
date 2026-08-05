import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { cn } from "@/lib/cn";
import type {
  Banner,
  BannerInput,
  BannerOverlay,
  BannerPlacement,
  BannerStatusKey,
} from "@/services/banners/banners.types";
import { BANNER_STATUS, OVERLAY_LABEL, PLACEMENT_LABEL } from "../lib/banners.helpers";

type BannerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSubmit: (values: BannerInput) => void;
  pending?: boolean;
};

const PLACEMENTS: BannerPlacement[] = ["home", "category", "checkout"];
const OVERLAYS: BannerOverlay[] = ["brand", "dark"];
const STATUSES: BannerStatusKey[] = ["active", "paused", "draft"];

type Draft = {
  placement: BannerPlacement;
  order: number;
  img: string;
  kicker: { ru: string; tm: string };
  title: { ru: string; tm: string };
  ctaLabel: { ru: string; tm: string };
  to: string;
  overlay: BannerOverlay;
  startsAt: string;
  endsAt: string;
  st: BannerStatusKey;
};

const EMPTY: Draft = {
  placement: "home",
  order: 1,
  img: "",
  kicker: { ru: "", tm: "" },
  title: { ru: "", tm: "" },
  ctaLabel: { ru: "", tm: "" },
  to: "",
  overlay: "brand",
  startsAt: "",
  endsAt: "",
  st: "draft",
};

/** ISO → значение для <input type="datetime-local"> (первые 16 символов). */
const toLocal = (iso: string | null): string => (iso ? iso.slice(0, 16) : "");

export function BannerFormDialog({
  open,
  onOpenChange,
  banner,
  onSubmit,
  pending,
}: BannerFormDialogProps) {
  const t = useT();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setImgError(false);
    setDraft(
      banner
        ? {
            placement: banner.placement,
            order: banner.order,
            img: banner.img,
            kicker: { ...banner.kicker },
            title: { ...banner.title },
            ctaLabel: { ...banner.ctaLabel },
            to: banner.to,
            overlay: banner.overlay,
            startsAt: toLocal(banner.startsAt),
            endsAt: toLocal(banner.endsAt),
            st: banner.st,
          }
        : EMPTY,
    );
  }, [open, banner]);

  function setLoc(
    field: "kicker" | "title" | "ctaLabel",
    lang: "ru" | "tm",
    value: string,
  ) {
    setDraft((d) => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  }

  function submit() {
    if (!draft.img.trim()) {
      setImgError(true);
      return;
    }
    const input: BannerInput = {
      placement: draft.placement,
      order: draft.order,
      img: draft.img.trim(),
      kicker: draft.kicker,
      title: draft.title,
      ctaLabel: draft.ctaLabel,
      to: draft.to.trim(),
      overlay: draft.overlay,
      startsAt: draft.startsAt ? new Date(draft.startsAt).toISOString() : null,
      endsAt: draft.endsAt ? new Date(draft.endsAt).toISOString() : null,
      st: draft.st,
    };
    onSubmit(input);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {banner ? t("banners.dialog.edit") : t("banners.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("banners.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <Field
            label={t("banners.form.img")}
            error={imgError ? t("err.imgRequired") : undefined}
          >
            <ImageUploadField
              value={draft.img}
              invalid={imgError}
              onChange={(url) => setDraft((d) => ({ ...d, img: url }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("banners.form.titleRu")}>
              <Input
                value={draft.title.ru}
                onChange={(e) => setLoc("title", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.titleTm")}>
              <Input
                value={draft.title.tm}
                onChange={(e) => setLoc("title", "tm", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.kickerRu")}>
              <Input
                value={draft.kicker.ru}
                onChange={(e) => setLoc("kicker", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.kickerTm")}>
              <Input
                value={draft.kicker.tm}
                onChange={(e) => setLoc("kicker", "tm", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.ctaRu")}>
              <Input
                value={draft.ctaLabel.ru}
                onChange={(e) => setLoc("ctaLabel", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.ctaTm")}>
              <Input
                value={draft.ctaLabel.tm}
                onChange={(e) => setLoc("ctaLabel", "tm", e.target.value)}
              />
            </Field>
          </div>

          <Field label={t("banners.form.to")}>
            <Input
              value={draft.to}
              onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
              placeholder="/catalog?cat=audio · /product/5 · /brand/Apple"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Segmented
              label={t("form.placement")}
              value={draft.placement}
              options={PLACEMENTS.map((p) => ({
                value: p,
                label: t(PLACEMENT_LABEL[p]),
              }))}
              onChange={(v) =>
                setDraft((d) => ({ ...d, placement: v as BannerPlacement }))
              }
            />
            <Field label={t("banners.form.order")}>
              <Input
                type="number"
                min={0}
                value={draft.order}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, order: Number(e.target.value) }))
                }
              />
            </Field>
          </div>

          <Segmented
            label={t("banners.form.overlay")}
            value={draft.overlay}
            options={OVERLAYS.map((o) => ({ value: o, label: t(OVERLAY_LABEL[o]) }))}
            onChange={(v) => setDraft((d) => ({ ...d, overlay: v as BannerOverlay }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("banners.form.startsAt")}>
              <Input
                type="datetime-local"
                value={draft.startsAt}
                onChange={(e) => setDraft((d) => ({ ...d, startsAt: e.target.value }))}
              />
            </Field>
            <Field label={t("banners.form.endsAt")}>
              <Input
                type="datetime-local"
                value={draft.endsAt}
                onChange={(e) => setDraft((d) => ({ ...d, endsAt: e.target.value }))}
              />
            </Field>
          </div>

          <Segmented
            label={t("form.status")}
            value={draft.st}
            options={STATUSES.map((s) => ({
              value: s,
              label: t(BANNER_STATUS[s].labelKey),
            }))}
            onChange={(v) => setDraft((d) => ({ ...d, st: v as BannerStatusKey }))}
          />

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : banner ? t("common.save") : t("common.add")}
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

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-ink/70">{label}</label>
      <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
              value === o.value ? "bg-brand text-white" : "text-muted hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
