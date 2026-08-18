import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import type { ProductRow } from "../lib/products.helpers";

type ProductsTableProps = {
  rows: ProductRow[];
  onEdit: (row: ProductRow) => void;
  onDelete: (row: ProductRow) => void;
};

export function ProductsTable({ rows, onEdit, onDelete }: ProductsTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.product")}</th>
            <th className="px-5 py-3 text-right font-semibold">
              {t("form.price")}
            </th>
            <th className="px-5 py-3 text-right font-semibold">
              {t("form.oldPrice")}
            </th>
            <th className="px-5 py-3 text-right font-semibold">
              {t("form.stock")}
            </th>
            <th className="px-5 py-3 text-right font-semibold">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="max-w-xs px-5 py-3.5">
                <div className="truncate font-display font-bold text-ink">
                  {r.displayName}
                </div>
                {(r.shortRu || r.shortTm) && (
                  <div className="truncate text-xs text-muted">
                    {r.shortRu || r.shortTm}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.priceFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted line-through">
                {r.oldPriceFmt || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                {r.stockFmt}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={"Редактировать " + r.displayName}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Удалить " + r.displayName}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
