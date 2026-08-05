import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { DriverRow } from "../lib/drivers.helpers";

type DriversTableProps = {
  rows: DriverRow[];
  onEdit: (row: DriverRow) => void;
  onDelete: (row: DriverRow) => void;
};

export function DriversTable({ rows, onEdit, onDelete }: DriversTableProps) {
  const t = useT();
  const plural = usePlural();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.courier")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.phone")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.zone")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.deliveries")}</th>
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
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                    {r.initials}
                  </span>
                  <span className="font-semibold text-ink">{r.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.phone}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.zone}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {plural(r.deliveries, "plural.delivery")}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={"Редактировать " + r.name}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Удалить " + r.name}
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
