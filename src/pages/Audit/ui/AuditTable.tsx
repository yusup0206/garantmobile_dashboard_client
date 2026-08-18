import { useT } from "@/i18n/useT";
import type { AuditLog } from "@/services/audit/audit.types";
import { Table } from "@/components/ui/Table";
import { actionClass, actionLabel, fmtAuditDate } from "../lib/audit.helpers";

export function AuditTable({ rows }: { rows: AuditLog[] }) {
  const t = useT();
  return (
    <Table className="min-w-[860px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("audit.col.date")}</Table.Head>
          <Table.Head>{t("audit.col.staff")}</Table.Head>
          <Table.Head>{t("audit.col.action")}</Table.Head>
          <Table.Head>{t("audit.col.resource")}</Table.Head>
          <Table.Head>{t("audit.col.object")}</Table.Head>
          <Table.Head className="text-right">{t("audit.col.request")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="whitespace-nowrap text-muted">
              {fmtAuditDate(r.date)}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-ink">
              {r.staffName}
            </Table.Cell>
            <Table.Cell>
              <span
                className={
                  "inline-block rounded-md px-2 py-0.5 text-xs font-semibold " +
                  actionClass(r.action)
                }
              >
                {t(actionLabel(r.action))}
              </span>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-ink">{r.resource}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.resourceId ?? "—"}
            </Table.Cell>
            <Table.Cell
              className="whitespace-nowrap text-right font-mono text-xs text-muted"
              title={r.path}
            >
              {r.method} · {r.statusCode}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
