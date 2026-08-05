import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu, type StatusOption } from "@/components/common/StatusMenu";
import type { TradeinRow } from "../lib/tradein.helpers";

type TradeinTableProps = {
  rows: TradeinRow[];
  options: StatusOption[];
  onStatus: (id: string, st: string) => void;
};

export function TradeinTable({ rows, options, onStatus }: TradeinTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.claim")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.device")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.customer")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.rating")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.date")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-display font-bold text-ink">
                {r.id}
              </td>
              <td className="max-w-xs px-5 py-3.5">
                <div className="truncate text-ink">{r.device}</div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.customer}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.estimateFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.date}</td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end">
                  <StatusMenu
                    options={options}
                    value={r.st}
                    onSelect={(st) => onStatus(r.id, st)}
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
