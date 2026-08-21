import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Eye, Phone } from "lucide-react";
import type { OrderRow } from "../lib/orders.helpers";

type OrdersTableProps = {
  rows: OrderRow[];
  options: StatusOption[];
  onStatus: (id: string, st: string) => void;
  onViewDetails: (order: OrderRow) => void;
};

export function OrdersTable({
  rows,
  options,
  onStatus,
  onViewDetails,
}: OrdersTableProps) {
  const t = useT();
  const plural = usePlural();

  return (
    <Table
      className="min-w-[840px]"
      containerClassName="rounded-2xl border border-line bg-surface"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.order")}</Table.Head>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head>{t("form.products")}</Table.Head>
          <Table.Head>{t("form.date")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("form.amount")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row
            key={r.id || r.orderNumber}
            className="group cursor-pointer transition-colors hover:bg-canvas/50"
            onClick={() => onViewDetails(r)}
          >
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              <span className="text-brand-dark group-hover:underline">
                {r.orderNumber}
              </span>
            </Table.Cell>

            <Table.Cell className="max-w-[200px]">
              <div className="truncate font-medium text-ink">{r.customerName}</div>
              {r.customerPhone !== "—" && (
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Phone className="h-3 w-3" />
                  <span>{r.customerPhone}</span>
                </div>
              )}
            </Table.Cell>

            <Table.Cell className="max-w-xs">
              <div className="truncate text-ink">{r.productLabel}</div>
              <div className="text-xs text-muted">
                {plural(r.count, "plural.product")}
              </div>
            </Table.Cell>

            <Table.Cell className="whitespace-nowrap text-xs text-muted">
              {r.formattedDate}
            </Table.Cell>

            <Table.Cell onClick={(e) => e.stopPropagation()}>
              <StatusBadge meta={r.meta} />
            </Table.Cell>

            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.totalFmt}
            </Table.Cell>

            <Table.Cell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(r)}
                  className="h-8 w-8 p-0 text-muted hover:text-ink"
                  title={t("orders.details.viewDetails")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <StatusMenu
                  options={options}
                  value={r.status}
                  onSelect={(st) => onStatus(r.id || r.orderNumber, st)}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
