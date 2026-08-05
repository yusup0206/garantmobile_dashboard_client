import { Plus, Trash2, X } from "lucide-react";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type {
  ProductVariant,
  ProductVariantStatusKey,
} from "@/services/products/products.types";

type VariantsEditorProps = {
  variants: ProductVariant[];
  onChange: (next: ProductVariant[]) => void;
  /** SKU error keys by variant index (empty / duplicate). */
  errors?: Record<number, TKey | undefined>;
  disabled?: boolean;
};

const STATUSES: ProductVariantStatusKey[] = ["active", "archived"];
const STATUS_LABEL: Record<ProductVariantStatusKey, TKey> = {
  active: "products.variant.st.active",
  archived: "products.variant.st.archived",
};

const EMPTY_VARIANT: ProductVariant = {
  sku: "",
  price: 0,
  oldPrice: null,
  stock: 0,
  status: "active",
  options: [],
};

export function VariantsEditor({
  variants,
  onChange,
  errors,
  disabled,
}: VariantsEditorProps) {
  const t = useT();

  const patchVariant = (index: number, patch: Partial<ProductVariant>) =>
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  const addVariant = () => onChange([...variants, { ...EMPTY_VARIANT, options: [] }]);
  const removeVariant = (index: number) =>
    onChange(variants.filter((_, i) => i !== index));

  const patchOption = (
    vi: number,
    oi: number,
    patch: Partial<ProductVariant["options"][number]>,
  ) =>
    patchVariant(vi, {
      options: variants[vi].options.map((o, i) => (i === oi ? { ...o, ...patch } : o)),
    });
  const addOption = (vi: number) =>
    patchVariant(vi, { options: [...variants[vi].options, { name: "", value: "" }] });
  const removeOption = (vi: number, oi: number) =>
    patchVariant(vi, { options: variants[vi].options.filter((_, i) => i !== oi) });

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-line bg-canvas/60 p-3.5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-ink">{t("products.variant.title")}</div>
          <p className="mt-0.5 text-xs text-muted">{t("products.variant.hint")}</p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          disabled={disabled}
          className="inline-flex flex-none items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("products.variant.add")}
        </button>
      </header>

      {variants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs text-faint">
          {t("products.variant.none")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {variants.map((variant, vi) => (
            <li
              key={vi}
              className="flex flex-col gap-2.5 rounded-xl border border-line bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    aria-label={t("products.variant.sku")}
                    placeholder={t("products.variant.sku")}
                    value={variant.sku}
                    invalid={!!errors?.[vi]}
                    onChange={(e) => patchVariant(vi, { sku: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="inline-flex flex-none rounded-lg border border-line bg-canvas p-0.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => patchVariant(vi, { status: s })}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                        variant.status === s
                          ? "bg-brand text-white"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      {t(STATUS_LABEL[s])}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label={t("products.variant.remove")}
                  onClick={() => removeVariant(vi)}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {errors?.[vi] ? (
                <p className="-mt-1 text-xs text-red-600">{t(errors[vi] as TKey)}</p>
              ) : null}

              <div className="grid grid-cols-3 gap-2">
                <NumberField
                  label={t("products.variant.price")}
                  value={variant.price}
                  onChange={(n) => patchVariant(vi, { price: n ?? 0 })}
                />
                <NumberField
                  label={t("products.variant.oldPrice")}
                  value={variant.oldPrice}
                  nullable
                  onChange={(n) => patchVariant(vi, { oldPrice: n })}
                />
                <NumberField
                  label={t("products.variant.stock")}
                  value={variant.stock}
                  onChange={(n) => patchVariant(vi, { stock: n ?? 0 })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink/70">
                  {t("products.variant.options")}
                </span>
                {variant.options.map((option, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Input
                      aria-label={t("products.variant.optName")}
                      placeholder={t("products.variant.optName")}
                      value={option.name}
                      onChange={(e) => patchOption(vi, oi, { name: e.target.value })}
                      className="h-9 flex-1"
                    />
                    <Input
                      aria-label={t("products.variant.optValue")}
                      placeholder={t("products.variant.optValue")}
                      value={option.value}
                      onChange={(e) => patchOption(vi, oi, { value: e.target.value })}
                      className="h-9 flex-1"
                    />
                    <button
                      type="button"
                      aria-label={t("products.variant.removeOption")}
                      onClick={() => removeOption(vi, oi)}
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-red-300 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(vi)}
                  className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("products.variant.addOption")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  nullable,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  nullable?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-ink/60">{label}</span>
      <Input
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(nullable ? null : 0);
            return;
          }
          onChange(Number(raw));
        }}
        className="h-10"
      />
    </label>
  );
}
