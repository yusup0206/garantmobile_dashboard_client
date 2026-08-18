import { Pencil, Trash2, Users, CheckCircle2, XCircle } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { PromocodeRow } from "../lib/promocodes.helpers";

type PromocodesTableProps = {
  rows: PromocodeRow[];
  onEdit: (row: PromocodeRow) => void;
  onDelete: (row: PromocodeRow) => void;
};

/** Format an ISO date string to a readable short form: "14 Aug 2026" */
function fmtDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PromocodesTable({ rows, onEdit, onDelete }: PromocodesTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.promocode")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.discount")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.minOrderAmount")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.used")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.startsAt")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.expiresAt")}</th>
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
              {/* Code + flags */}
              <td className="whitespace-nowrap px-5 py-3.5">
                <span className="font-display font-bold text-ink">{r.code}</span>
                <span className="ml-2 inline-flex gap-1">
                  {r.isForNewClients && (
                    <span
                      title={t("form.isForNewClients")}
                      className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600"
                    >
                      <Users className="mr-0.5 h-2.5 w-2.5" />
                      NEW
                    </span>
                  )}
                </span>
              </td>

              {/* Discount */}
              <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-ink">
                {r.discount}
              </td>

              {/* Min order */}
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.minOrderAmount > 0 ? `${r.minOrderAmount} m` : "—"}
              </td>

              {/* Usage */}
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                {r.usageFmt}
              </td>

              {/* Dates */}
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {fmtDate(r.startsAt)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {fmtDate(r.expiresAt)}
              </td>

              {/* Status */}
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={"Edit " + r.code}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Delete " + r.code}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
