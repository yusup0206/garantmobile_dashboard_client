import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/Button";
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
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.customer")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.city")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.ordersCount")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.totalSpent")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("cust.col.bonus")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                    {r.initials}
                  </span>
                  <span className="font-semibold text-ink">{r.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.city}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                {plural(r.orders, "plural.order")}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.spentFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right tabular-nums text-ink">
                {fmt(r.bonusBalance)}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAdjustBonus(r)}
                >
                  {t("cust.bonus.action")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
