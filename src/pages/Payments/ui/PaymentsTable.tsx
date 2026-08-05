import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit2, Trash2 } from "lucide-react";
import type { PaymentType } from "@/services/payments/payments.types";
import type { PaymentRow } from "../lib/payments.helpers";

type PaymentsTableProps = {
  rows: PaymentRow[];
  onEdit: (pt: PaymentType) => void;
  onDelete: (pt: PaymentType) => void;
};

export function PaymentsTable({ rows, onEdit, onDelete }: PaymentsTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Название</th>
            <th className="px-5 py-3 font-semibold">Описание</th>
            <th className="px-5 py-3 font-semibold">Процент / Бонус</th>
            <th className="px-5 py-3 font-semibold">Переплата</th>
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
                <div>{r.titleRu}</div>
                <div className="text-xs font-normal text-muted">{r.titleTk}</div>
              </td>
              <td className="px-5 py-3.5 text-muted max-w-xs truncate">
                {r.descriptionRu || r.descriptionTk || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">
                <span className="font-semibold text-brand">{r.paymentProcent}%</span>
                <span className="text-muted mx-1">/</span>
                <span className="font-semibold text-emerald-600">+{r.paymentBonus}%</span>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {String(r.isOverpayment) === "true" ? (
                  <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                    Да
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-500">
                    Нет
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.statusMeta} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(r)}
                    className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink transition-colors"
                    title={t("common.edit")}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(r)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 transition-colors"
                    title={t("common.delete")}
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
