import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
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
    <Table containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.courier")}</Table.Head>
          <Table.Head>{t("form.phone")}</Table.Head>
          <Table.Head>{t("form.zone")}</Table.Head>
          <Table.Head className="text-right">{t("form.deliveries")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
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
            <Table.Cell className="whitespace-nowrap text-muted">{r.phone}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{r.zone}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {plural(r.deliveries, "plural.delivery")}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
