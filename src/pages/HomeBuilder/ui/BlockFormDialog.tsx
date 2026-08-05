import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Category } from "@/services/categories/categories.types";
import { type HomeBlock, type HomeBlockKind } from "@/services/home/home.types";
import { ALL_KINDS, KIND_LABEL, newBlock } from "../lib/home.helpers";

type BlockFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, edits this block; otherwise creates a new one. */
  block: HomeBlock | null;
  categories: Category[];
  onSubmit: (block: HomeBlock) => void;
};

export function BlockFormDialog({
  open,
  onOpenChange,
  block,
  categories,
  onSubmit,
}: BlockFormDialogProps) {
  const t = useT();
  const [draft, setDraft] = useState<HomeBlock>(() => newBlock("product_rail", 0));
  const isEdit = block !== null;

  useEffect(() => {
    if (!open) return;
    setDraft(block ? { ...block } : newBlock("product_rail", 0));
  }, [open, block]);

  function setLoc(field: "title" | "subtitle", lang: "ru" | "tm", value: string) {
    setDraft((d) => ({ ...d, [field]: { ...d[field], [lang]: value } }));
  }

  function setProp(key: string, value: unknown) {
    setDraft((d) => ({ ...d, props: { ...d.props, [key]: value } }));
  }

  function changeKind(kind: HomeBlockKind) {
    setDraft((d) => ({
      ...newBlock(kind, d.order),
      id: d.id,
      title: d.title,
      subtitle: d.subtitle,
    }));
  }

  function changeCategory(idRaw: string) {
    if (!idRaw) {
      setDraft((d) => ({ ...d, categoryId: null, categorySlug: null }));
      return;
    }
    const id = Number(idRaw);
    const found = categories.find((c) => c.id === id);
    setDraft((d) => ({ ...d, categoryId: id, categorySlug: found?.slug ?? null }));
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {isEdit ? t("home.dialog.edit") : t("home.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("home.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(draft);
          }}
          className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <Field label={t("home.form.kind")}>
            <Select
              value={draft.kind}
              disabled={isEdit}
              onChange={(v) => changeKind(v as HomeBlockKind)}
              options={ALL_KINDS.map((k) => ({ value: k, label: t(KIND_LABEL[k]) }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("home.form.nameRu")}>
              <Input
                value={draft.title.ru}
                onChange={(e) => setLoc("title", "ru", e.target.value)}
                placeholder={t("home.form.namePlaceholder")}
              />
            </Field>
            <Field label={t("home.form.nameTm")}>
              <Input
                value={draft.title.tm}
                onChange={(e) => setLoc("title", "tm", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("home.form.subtitleRu")}>
              <Input
                value={draft.subtitle.ru}
                onChange={(e) => setLoc("subtitle", "ru", e.target.value)}
              />
            </Field>
            <Field label={t("home.form.subtitleTm")}>
              <Input
                value={draft.subtitle.tm}
                onChange={(e) => setLoc("subtitle", "tm", e.target.value)}
              />
            </Field>
          </div>

          <Field label={t("home.form.category")}>
            <Select
              value={draft.categoryId ? String(draft.categoryId) : ""}
              onChange={changeCategory}
              options={[
                { value: "", label: t("home.form.categoryNone") },
                ...categories.map((c) => ({ value: String(c.id), label: c.name })),
              ]}
            />
          </Field>

          <PropsEditor kind={draft.kind} props={draft.props} setProp={setProp} />

          <label className="mt-1 flex items-center gap-2.5 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={draft.visible}
              onChange={(e) => setDraft((d) => ({ ...d, visible: e.target.checked }))}
              className="h-4 w-4 rounded border-line accent-brand"
            />
            {t("home.form.visible")}
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{isEdit ? t("common.save") : t("common.add")}</Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/** Per-kind props editor — только осмысленные поля для каждого вида. */
function PropsEditor({
  kind,
  props,
  setProp,
}: {
  kind: HomeBlockKind;
  props: Record<string, unknown>;
  setProp: (key: string, value: unknown) => void;
}) {
  const t = useT();
  const num = (key: string) =>
    typeof props[key] === "number" ? (props[key] as number) : undefined;
  const str = (key: string) =>
    typeof props[key] === "string" ? (props[key] as string) : "";

  if (kind === "product_rail") {
    const source = str("source") || "new";
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("home.form.source")}>
          <Select
            value={source}
            onChange={(v) => setProp("source", v)}
            options={[
              "new",
              "sale",
              "top_rated",
              "category",
              "badge",
              "manual",
              "recent",
            ].map((s) => ({ value: s, label: t(("home.source." + s) as TKey) }))}
          />
        </Field>
        <NumberField
          label={t("home.form.limit")}
          value={num("limit")}
          onChange={(v) => setProp("limit", v)}
        />
        {source === "category" ? (
          <Field label={t("home.form.categorySlug")}>
            <Input
              value={str("categorySlug")}
              onChange={(e) => setProp("categorySlug", e.target.value)}
              placeholder="accessories"
            />
          </Field>
        ) : null}
        <Toggle
          label={t("home.form.boxed")}
          checked={props.boxed === true}
          onChange={(v) => setProp("boxed", v)}
        />
      </div>
    );
  }
  if (kind === "sale_week") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("home.form.endsAt")}>
          <Input
            type="datetime-local"
            value={str("endsAt")}
            onChange={(e) => setProp("endsAt", e.target.value || null)}
          />
        </Field>
        <NumberField
          label={t("home.form.limit")}
          value={num("limit")}
          onChange={(v) => setProp("limit", v)}
        />
      </div>
    );
  }
  if (kind === "banners") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("home.form.placement")}>
          <Select
            value={str("placement") || "home"}
            onChange={(v) => setProp("placement", v)}
            options={["home", "category", "checkout"].map((p) => ({
              value: p,
              label: p,
            }))}
          />
        </Field>
        <NumberField
          label={t("home.form.limit")}
          value={num("limit")}
          onChange={(v) => setProp("limit", v)}
        />
      </div>
    );
  }
  if (kind === "benefits") {
    return (
      <Field label={t("home.form.variant")}>
        <Select
          value={str("variant") || "grid"}
          onChange={(v) => setProp("variant", v)}
          options={["grid", "row"].map((v) => ({ value: v, label: v }))}
        />
      </Field>
    );
  }
  if (kind === "brands") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("home.form.variant")}>
          <Select
            value={str("variant") || "logos"}
            onChange={(v) => setProp("variant", v)}
            options={["logos", "chips"].map((v) => ({ value: v, label: v }))}
          />
        </Field>
        <NumberField
          label={t("home.form.limit")}
          value={num("limit")}
          onChange={(v) => setProp("limit", v)}
        />
      </div>
    );
  }
  if (kind === "blog_teasers" || kind === "category_grid" || kind === "preorder_promo") {
    return (
      <NumberField
        label={t("home.form.limit")}
        value={num("limit")}
        onChange={(v) => setProp("limit", v)}
      />
    );
  }
  return null;
}

// --- small controls (repo has no Select/Textarea) ---------------------------

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

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <Input
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-line accent-brand"
      />
      {label}
    </label>
  );
}
