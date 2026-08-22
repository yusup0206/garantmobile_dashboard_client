import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit2, Trash2 } from "lucide-react";
import { Table } from "@/components/ui/Table";
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
    <Table className="min-w-[720px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("payments.col.name")}</Table.Head>
          <Table.Head>{t("payments.col.description")}</Table.Head>
          <Table.Head>{t("payments.col.percentBonus")}</Table.Head>
          <Table.Head>{t("payments.col.overpayment")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              <div>{r.titleRu}</div>
              <div className="text-xs font-normal text-muted">{r.titleTk}</div>
            </Table.Cell>
            <Table.Cell className="text-muted max-w-xs truncate">
              {r.descriptionRu || r.descriptionTk || "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-ink">
              <span className="font-semibold text-brand">{r.paymentProcent}%</span>
              <span className="text-muted mx-1">/</span>
              <span className="font-semibold text-emerald-600">+{r.paymentBonus}%</span>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {String(r.isOverpayment) === "true" ? (
                <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                  {t("payments.overpayment.yes")}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {t("payments.overpayment.no")}
                </span>
              )}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.statusMeta} />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right">
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
