import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Category } from "@/services/categories/categories.types";
import {
  type HomeBlock,
  type HomeBlockKind,
  type CreateHomeBlockInput,
  type UpdateHomeBlockInput,
} from "@/services/home/home.types";
import {
  ALL_KINDS,
  KIND_LABEL,
  PRODUCT_SOURCES,
  defaultItemsLimit,
  newBlockInput,
} from "../lib/home.helpers";

type BlockFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: HomeBlock | null;
  categories: Category[];
  onSubmit: (values: CreateHomeBlockInput | UpdateHomeBlockInput) => void;
  isSaving?: boolean;
};

export function BlockFormDialog({
  open,
  onOpenChange,
  block,
  categories,
  onSubmit,
  isSaving,
}: BlockFormDialogProps) {
  const t = useT();
  const isEdit = block !== null;

  const [kind, setKind] = useState<HomeBlockKind>("products");
  const [titleRu, setTitleRu] = useState("");
  const [titleTk, setTitleTk] = useState("");
  const [subtitleRu, setSubtitleRu] = useState("");
  const [subtitleTk, setSubtitleTk] = useState("");
  const [itemsLimit, setItemsLimit] = useState<number | undefined>(8);
  const [productSource, setProductSource] = useState<string>("newest");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"active" | "hidden">("active");

  useEffect(() => {
    if (!open) return;
    if (block) {
      setKind(block.kind);
      setTitleRu(block.titleRu || "");
      setTitleTk(block.titleTk || "");
      setSubtitleRu(block.subtitleRu || "");
      setSubtitleTk(block.subtitleTk || "");
      setItemsLimit(block.itemsLimit ?? undefined);
      setProductSource(block.productSource || "newest");
      setCategoryId(block.categoryId ? String(block.categoryId) : "");
      setStatus(block.status || "active");
    } else {
      const initial = newBlockInput("products");
      setKind(initial.kind);
      setTitleRu("");
      setTitleTk("");
      setSubtitleRu("");
      setSubtitleTk("");
      setItemsLimit(initial.itemsLimit);
      setProductSource("newest");
      setCategoryId("");
      setStatus("active");
    }
  }, [open, block]);

  function handleKindChange(nextKind: HomeBlockKind) {
    setKind(nextKind);
    if (!isEdit) {
      setItemsLimit(defaultItemsLimit(nextKind));
      if (nextKind === "products" && !productSource) {
        setProductSource("newest");
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...(isEdit ? {} : { kind }),
      titleRu,
      titleTk,
      subtitleRu: subtitleRu || undefined,
      subtitleTk: subtitleTk || undefined,
      itemsLimit: itemsLimit ? Number(itemsLimit) : undefined,
      productSource: kind === "products" ? productSource : undefined,
      categoryId: (kind === "categories" || (kind === "products" && productSource === "category")) && categoryId ? categoryId : undefined,
      status,
    };
    onSubmit(payload);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {isEdit ? t("home.dialog.edit") : t("home.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("home.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <Field label={t("home.form.kind")}>
            <Select
              value={kind}
              disabled={isEdit}
              onChange={(v) => handleKindChange(v as HomeBlockKind)}
              options={ALL_KINDS.map((k) => ({ value: k, label: t(KIND_LABEL[k]) }))}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("home.form.nameRu")}>
              <Input
                required
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                placeholder={t("home.form.namePlaceholder")}
              />
            </Field>
            <Field label={t("home.form.nameTm")}>
              <Input
                required
                value={titleTk}
                onChange={(e) => setTitleTk(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("home.form.subtitleRu")}>
              <Input
                value={subtitleRu}
                onChange={(e) => setSubtitleRu(e.target.value)}
              />
            </Field>
            <Field label={t("home.form.subtitleTm")}>
              <Input
                value={subtitleTk}
                onChange={(e) => setSubtitleTk(e.target.value)}
              />
            </Field>
          </div>

          {/* Additional fields per kind */}
          {kind === "products" && (
            <Field label={t("home.form.source")}>
              <Select
                value={productSource}
                onChange={(v) => setProductSource(v)}
                options={PRODUCT_SOURCES.map((s) => ({
                  value: s.value,
                  label: t(s.labelKey),
                }))}
              />
            </Field>
          )}

          {(kind === "categories" || (kind === "products" && productSource === "category")) && (
            <Field label={t("home.form.category")}>
              <Select
                value={categoryId}
                onChange={(v) => setCategoryId(v)}
                options={[
                  { value: "", label: t("home.form.categoryNone") },
                  ...categories.map((c) => ({
                    value: String(c.id),
                    label: c.nameRu || c.nameTk || String(c.id),
                  })),
                ]}
              />
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("home.form.limit")}>
              <Input
                type="number"
                min={1}
                max={50}
                value={itemsLimit ?? ""}
                onChange={(e) => setItemsLimit(e.target.value ? Number(e.target.value) : undefined)}
              />
            </Field>

            <Field label={t("form.status")}>
              <Select
                value={status}
                onChange={(v) => setStatus(v as "active" | "hidden")}
                options={[
                  { value: "active", label: t("status.hero.on") },
                  { value: "hidden", label: t("status.hero.off") },
                ]}
              />
            </Field>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-line pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? t("common.saving")
                : isEdit
                  ? t("common.save")
                  : t("common.add")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-ink/70">{label}</label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-12 w-full rounded-xl border border-line bg-canvas px-3 text-[15px] font-semibold text-ink outline-none transition-colors",
        "focus:border-brand focus:bg-white disabled:opacity-60",
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
