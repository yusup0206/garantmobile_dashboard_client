import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { AdminRow } from "../lib/admins.helpers";

type AdminsTableProps = {
  rows: AdminRow[];
  onEdit?: (row: AdminRow) => void;
  onDelete?: (row: AdminRow) => void;
};

export function AdminsTable({
  rows,
  onEdit,
  onDelete,
}: AdminsTableProps) {
  const t = useT();
  const canWrite = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.staffMember")}</th>
            <th className="px-5 py-3 font-semibold">Телефон</th>
            <th className="px-5 py-3 font-semibold">{t("E-mail")}</th>
            <th className="px-5 py-3 font-semibold">Роли</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            {canWrite ? (
              <th className="px-5 py-3 text-right font-semibold">
                {t("common.actions")}
              </th>
            ) : null}
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
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.phone || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.email}</td>
              <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-brand">
                {r.roleNames}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              {canWrite ? (
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                        aria-label={"Редактировать " + r.name}
                        title="Редактировать"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={"Удалить " + r.name}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
