import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { PromocodeRow } from "../lib/promocodes.helpers";

type PromocodesTableProps = {
  rows: PromocodeRow[];
  onEdit: (row: PromocodeRow) => void;
  onDelete: (row: PromocodeRow) => void;
};

export function PromocodesTable({ rows, onEdit, onDelete }: PromocodesTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.promocode")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.discount")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.used")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.period")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.code}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-display font-bold text-ink">
                {r.code}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.discount}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                {r.usageFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.period}</td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={"Редактировать " + r.code}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Удалить " + r.code}
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
