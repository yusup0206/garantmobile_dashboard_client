import { useNavigate } from "react-router-dom";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Table } from "@/components/ui/Table";
import type { ProductRow } from "../lib/products.helpers";

type ProductsTableProps = {
  rows: ProductRow[];
  onEdit: (row: ProductRow) => void;
  onDelete: (row: ProductRow) => void;
};

export function ProductsTable({ rows, onEdit, onDelete }: ProductsTableProps) {
  const navigate = useNavigate();
  const t = useT();

  return (
    <Table containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.product")}</Table.Head>
          <Table.Head className="text-right">{t("form.price")}</Table.Head>
          <Table.Head className="text-right">{t("form.oldPrice")}</Table.Head>
          <Table.Head className="text-right">{t("form.stock")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row
            key={r.id}
            className="cursor-pointer transition-colors hover:bg-canvas/60"
            onClick={() => navigate(`/products/${r.id}`)}
          >
            <Table.Cell className="max-w-xs">
              <div className="truncate font-display font-bold text-ink hover:text-brand transition-colors">
                {r.displayName}
              </div>
              {(r.shortRu || r.shortTk) && (
                <div className="truncate text-xs text-muted">
                  {r.shortRu || r.shortTk}
                </div>
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.priceFmt}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right text-muted line-through">
              {r.oldPriceFmt || "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right text-muted">
              {r.stockFmt}
            </Table.Cell>
            <Table.Cell>
              <div
                className="flex justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onEdit(r)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                  aria-label={"Редактировать " + r.displayName}
                  title="Редактировать"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(r)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={"Удалить " + r.displayName}
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/products/${r.id}`)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-dark transition-colors hover:bg-brand hover:text-white"
                  aria-label={"Открыть детали " + r.displayName}
                  title="Характеристики и детали"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
