import { useT } from "@/i18n/useT";
import type { StockMovement } from "@/services/inventory/inventory.types";
import { REASON_LABEL, fmtDelta, fmtMovementDate } from "../lib/inventory.helpers";

export function MovementsTable({ rows }: { rows: StockMovement[] }) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("inv.col.date")}</th>
            <th className="px-5 py-3 font-semibold">{t("inv.col.product")}</th>
            <th className="px-5 py-3 font-semibold">{t("inv.col.sku")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("inv.col.delta")}</th>
            <th className="px-5 py-3 font-semibold">{t("inv.col.reason")}</th>
            <th className="px-5 py-3 font-semibold">{t("inv.col.ref")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr
              key={m.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {fmtMovementDate(m.date)}
              </td>
              <td className="px-5 py-3.5 font-semibold text-ink">{m.product}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{m.sku ?? "—"}</td>
              <td
                className={
                  "whitespace-nowrap px-5 py-3.5 text-right font-display font-bold tabular-nums " +
                  (m.delta >= 0 ? "text-green-600" : "text-red-600")
                }
              >
                {fmtDelta(m.delta)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {t(REASON_LABEL[m.reason])}
              </td>
              <td className="px-5 py-3.5 text-muted">{m.orderNumber ?? m.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
