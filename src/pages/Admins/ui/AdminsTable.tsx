import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
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
    <Table containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.staffMember")}</Table.Head>
          <Table.Head>Телефон</Table.Head>
          <Table.Head>{t("E-mail")}</Table.Head>
          <Table.Head>Роли</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          {canWrite ? (
            <Table.Head className="text-right">
              {t("common.actions")}
            </Table.Head>
          ) : null}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                  {r.initials}
                </span>
                <span className="font-semibold text-ink">{r.name}</span>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.phone || "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{r.email}</Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-brand">
              {r.roleNames}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            {canWrite ? (
              <Table.Cell>
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
              </Table.Cell>
            ) : null}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
