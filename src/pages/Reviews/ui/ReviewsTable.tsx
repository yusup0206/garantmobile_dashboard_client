import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import type { ReviewRow } from "../lib/reviews.helpers";

type ReviewsTableProps = {
  rows: ReviewRow[];
  options: StatusOption[];
  onStatus: (id: number, st: string) => void;
};

export function ReviewsTable({ rows, options, onStatus }: ReviewsTableProps) {
  const t = useT();
  return (
    <Table className="min-w-[720px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head>{t("form.product")}</Table.Head>
          <Table.Head>{t("form.rating")}</Table.Head>
          <Table.Head>{t("form.review")}</Table.Head>
          <Table.Head>{t("form.date")}</Table.Head>
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
                <span className="font-semibold text-ink">{r.author}</span>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-ink">{r.product}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-[#e0a144]">{r.stars}</Table.Cell>
            <Table.Cell className="max-w-xs">
              <div className="truncate text-muted">{r.text}</div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{r.date}</Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex justify-end">
                <StatusMenu
                  options={options}
                  value={r.st}
                  onSelect={(st) => onStatus(r.id, st)}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
