import { useEffect, useState } from "react";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProducts, useProductDetail } from "@/services/products/useProducts";
import { useAdjustStock } from "@/services/inventory/useInventory";

type AdjustStockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const selectCls =
  "h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-brand";

const REASONS = ["restock", "adjustment"] as const;
const REASON_LABEL = {
  restock: "inv.reason.restock",
  adjustment: "inv.reason.adjustment",
} as const;

/** Manual stock correction / receiving against a product or one of its variants. */
export function AdjustStockDialog({ open, onOpenChange }: AdjustStockDialogProps) {
  const t = useT();
  const { data: products = [] } = useProducts();
  const adjust = useAdjustStock();

  const [productId, setProductId] = useState<number | "">("");
  const [variantId, setVariantId] = useState<number | "">("");
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState<(typeof REASONS)[number]>("restock");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: detail } = useProductDetail(open && productId !== "" ? productId : null);
  const variants = detail?.variants ?? [];

  useEffect(() => {
    if (open) {
      setProductId("");
      setVariantId("");
      setDelta("");
      setReason("restock");
      setNote("");
      setError(null);
    }
  }, [open]);

  const submit = async () => {
    setError(null);
    const value = Number(delta);
    if (productId === "") {
      setError(t("inv.adj.err_product"));
      return;
    }
    if (!Number.isInteger(value) || value === 0) {
      setError(t("inv.adj.err_delta"));
      return;
    }
    try {
      await adjust.mutateAsync({
        productId,
        ...(variantId !== "" ? { variantId } : {}),
        delta: value,
        reason,
        note: note.trim() || undefined,
      });
      onOpenChange(false);
    } catch {
      setError(t("inv.adj.err_failed"));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{t("inv.adj.title")}</Dialog.Title>
        <Dialog.Description>{t("inv.adj.desc")}</Dialog.Description>

        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">
              {t("inv.adj.product")}
            </span>
            <select
              className={selectCls}
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value === "" ? "" : Number(e.target.value));
                setVariantId("");
              }}
            >
              <option value="">{t("inv.adj.product_ph")}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {variants.length > 0 && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink/70">
                {t("inv.adj.variant")}
              </span>
              <select
                className={selectCls}
                value={variantId}
                onChange={(e) =>
                  setVariantId(e.target.value === "" ? "" : Number(e.target.value))
                }
              >
                <option value="">{t("inv.adj.variant_whole")}</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.sku}
                    {v.options.length
                      ? ` · ${v.options.map((o) => o.value).join(" · ")}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">
              {t("inv.adj.delta")}
            </span>
            <Input
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              placeholder="+10 / -1"
            />
            <span className="text-[11px] text-muted">{t("inv.adj.delta_hint")}</span>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">
              {t("inv.adj.reason")}
            </span>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    reason === r ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(REASON_LABEL[r])}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">{t("inv.adj.note")}</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("inv.adj.note_ph")}
              className="h-20 w-full resize-none rounded-xl border border-line bg-canvas p-3 text-sm outline-none focus:border-brand"
            />
          </label>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={submit} disabled={adjust.isPending}>
              {adjust.isPending ? t("inv.adj.submitting") : t("inv.adj.submit")}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
