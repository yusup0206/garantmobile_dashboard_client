import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Table } from "@/components/ui/Table";
import type { ProductRow } from "../lib/products.helpers";

type ProductsTableProps = {
  rows: ProductRow[];
  onEdit: (row: ProductRow) => void;
  onDelete: (row: ProductRow) => void;
};

export function ProductsTable({ rows, onEdit, onDelete }: ProductsTableProps) {
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
          <Table.Row key={r.id}>
            <Table.Cell className="max-w-xs">
              <div className="truncate font-display font-bold text-ink">
                {r.displayName}
              </div>
              {(r.shortRu || r.shortTm) && (
                <div className="truncate text-xs text-muted">
                  {r.shortRu || r.shortTm}
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
