import { useT } from "@/i18n/useT";
import type { StockMovement } from "@/services/inventory/inventory.types";
import { Table } from "@/components/ui/Table";
import { REASON_LABEL, fmtDelta, fmtMovementDate } from "../lib/inventory.helpers";

export function MovementsTable({ rows }: { rows: StockMovement[] }) {
  const t = useT();
  return (
    <Table className="min-w-[760px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("inv.col.date")}</Table.Head>
          <Table.Head>{t("inv.col.product")}</Table.Head>
          <Table.Head>{t("inv.col.sku")}</Table.Head>
          <Table.Head className="text-right">{t("inv.col.delta")}</Table.Head>
          <Table.Head>{t("inv.col.reason")}</Table.Head>
          <Table.Head>{t("inv.col.ref")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((m) => (
          <Table.Row key={m.id}>
            <Table.Cell className="whitespace-nowrap text-muted">
              {fmtMovementDate(m.date)}
            </Table.Cell>
            <Table.Cell className="font-semibold text-ink">{m.product}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{m.sku ?? "—"}</Table.Cell>
            <Table.Cell
              className={
                "whitespace-nowrap text-right font-display font-bold tabular-nums " +
                (m.delta >= 0 ? "text-green-600" : "text-red-600")
              }
            >
              {fmtDelta(m.delta)}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {t(REASON_LABEL[m.reason])}
            </Table.Cell>
            <Table.Cell className="text-muted">{m.orderNumber ?? m.note ?? "—"}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
