import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import type { DeliveryRow } from "../lib/delivery.helpers";

type DeliveryTableProps = {
  rows: DeliveryRow[];
  options: StatusOption[];
  onStatus: (id: string, st: string) => void;
};

export function DeliveryTable({ rows, options, onStatus }: DeliveryTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.delivery")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.order")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.city")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.courier")}</th>
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
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.order}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.city}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.courier}</td>
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
