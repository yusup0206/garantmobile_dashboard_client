import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { fmt } from "@/lib/format";
import { Lock, Unlock, Mail, Phone } from "lucide-react";
import type { CustomerRow } from "../lib/customers.helpers";

export function CustomersTable({
  rows,
  onToggleBlock,
}: {
  rows: CustomerRow[];
  onToggleBlock: (row: CustomerRow) => void;
}) {
  const t = useT();
  const plural = usePlural();

  return (
    <Table
      className="min-w-[880px]"
      containerClassName="rounded-2xl border border-line bg-surface"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head>{t("form.city")}</Table.Head>
          <Table.Head className="text-right">{t("form.ordersCount")}</Table.Head>
          <Table.Head className="text-right">{t("cust.col.bonus")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
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
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-ink">
                    {r.name || "—"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    {r.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {r.phone}
                      </span>
                    )}
                    {r.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {r.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.city || "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right text-muted">
              {plural(r.ordersCount ?? 0, "plural.order")}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right tabular-nums text-ink">
              {fmt(r.bonusBalance ?? 0)}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-1.5">
                <StatusBadge meta={r.statusMeta} />
                {r.tier && <StatusBadge meta={r.tierMeta} />}
              </div>
            </Table.Cell>
            <Table.Cell className="text-right">
              <Button
                type="button"
                variant={r.isBlocked ? "outline" : "ghost"}
                size="sm"
                onClick={() => onToggleBlock(r)}
                className={
                  r.isBlocked
                    ? "text-brand hover:bg-brand/10"
                    : "text-muted hover:bg-red-50 hover:text-red-600"
                }
              >
                {r.isBlocked ? (
                  <>
                    <Unlock className="h-4 w-4 mr-1.5" />
                    {t("cust.action.unblock")}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-1.5" />
                    {t("cust.action.block")}
                  </>
                )}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
