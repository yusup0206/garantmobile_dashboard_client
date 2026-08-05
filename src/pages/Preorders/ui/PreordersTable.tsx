import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import type { PreorderRow } from "../lib/preorders.helpers";

type PreordersTableProps = {
  rows: PreorderRow[];
  options: StatusOption[];
  onStatus: (num: string, st: string) => void;
};

export function PreordersTable({ rows, options, onStatus }: PreordersTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.preorder")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.product")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.customer")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.prepay")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.amount")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.num}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-display font-bold text-ink">
                {r.num}
              </td>
              <td className="max-w-xs px-5 py-3.5">
                <div className="truncate text-ink">{r.product}</div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.customer}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.prepayFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.totalFmt}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end">
                  <StatusMenu
                    options={options}
                    value={r.st}
                    onSelect={(st) => onStatus(r.num, st)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
