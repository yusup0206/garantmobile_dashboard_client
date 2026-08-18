import { Pencil, Trash2, Users, CheckCircle2, XCircle } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
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
    <Table containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.promocode")}</Table.Head>
          <Table.Head>{t("form.discount")}</Table.Head>
          <Table.Head>{t("form.minOrderAmount")}</Table.Head>
          <Table.Head className="text-right">{t("form.used")}</Table.Head>
          <Table.Head>{t("form.startsAt")}</Table.Head>
          <Table.Head>{t("form.expiresAt")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            {/* Code + flags */}
            <Table.Cell className="whitespace-nowrap">
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
            </Table.Cell>

            {/* Discount */}
            <Table.Cell className="whitespace-nowrap font-semibold text-ink">
              {r.discount}
            </Table.Cell>

            {/* Min order */}
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.minOrderAmount > 0 ? `${r.minOrderAmount} m` : "—"}
            </Table.Cell>

            {/* Usage */}
            <Table.Cell className="whitespace-nowrap text-right text-muted">
              {r.usageFmt}
            </Table.Cell>

            {/* Dates */}
            <Table.Cell className="whitespace-nowrap text-muted">
              {fmtDate(r.startsAt)}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {fmtDate(r.expiresAt)}
            </Table.Cell>

            {/* Status */}
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>

            {/* Actions */}
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
