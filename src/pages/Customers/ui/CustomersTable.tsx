import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { fmt } from "@/lib/format";
import type { CustomerRow } from "../lib/customers.helpers";

export function CustomersTable({
  rows,
  onAdjustBonus,
}: {
  rows: CustomerRow[];
  onAdjustBonus: (row: CustomerRow) => void;
}) {
  const t = useT();
  const plural = usePlural();
  return (
    <Table className="min-w-[820px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head>{t("form.city")}</Table.Head>
          <Table.Head className="text-right">{t("form.ordersCount")}</Table.Head>
          <Table.Head className="text-right">{t("form.totalSpent")}</Table.Head>
          <Table.Head className="text-right">{t("cust.col.bonus")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                  {r.initials}
                </span>
                <span className="font-semibold text-ink">{r.name}</span>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{r.city}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right text-muted">
              {plural(r.orders, "plural.order")}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.spentFmt}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right tabular-nums text-ink">
              {fmt(r.bonusBalance)}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell className="text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAdjustBonus(r)}
              >
                {t("cust.bonus.action")}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
