import { useT } from "@/i18n/useT";
import type { AuditLog } from "@/services/audit/audit.types";
import { actionClass, actionLabel, fmtAuditDate } from "../lib/audit.helpers";

export function AuditTable({ rows }: { rows: AuditLog[] }) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("audit.col.date")}</th>
            <th className="px-5 py-3 font-semibold">{t("audit.col.staff")}</th>
            <th className="px-5 py-3 font-semibold">{t("audit.col.action")}</th>
            <th className="px-5 py-3 font-semibold">{t("audit.col.resource")}</th>
            <th className="px-5 py-3 font-semibold">{t("audit.col.object")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("audit.col.request")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {fmtAuditDate(r.date)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-ink">
                {r.staffName}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={
                    "inline-block rounded-md px-2 py-0.5 text-xs font-semibold " +
                    actionClass(r.action)
                  }
                >
                  {t(actionLabel(r.action))}
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.resource}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.resourceId ?? "—"}
              </td>
              <td
                className="whitespace-nowrap px-5 py-3.5 text-right font-mono text-xs text-muted"
                title={r.path}
              >
                {r.method} · {r.statusCode}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
