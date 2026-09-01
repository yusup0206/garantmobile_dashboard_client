import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Eye, Phone } from "lucide-react";
import type { ReviewRow } from "../lib/reviews.helpers";
import type { ReviewStatusKey } from "@/services/reviews/reviews.types";

type ReviewsTableProps = {
  rows: ReviewRow[];
  options: StatusOption[];
  onStatus: (id: string, status: ReviewStatusKey) => void;
  onView: (review: ReviewRow) => void;
};

export function ReviewsTable({ rows, options, onStatus, onView }: ReviewsTableProps) {
  const t = useT();

  return (
    <Table className="min-w-[760px]" containerClassName="rounded-2xl border border-line bg-surface">
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
          <Table.Row key={r.id} className="cursor-pointer hover:bg-canvas/50 transition-colors" onClick={() => onView(r)}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                  {r.initials}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-ink truncate">{r.authorName}</span>
                  {r.authorPhone && (
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Phone className="h-3 w-3 inline" />
                      {r.authorPhone}
                    </span>
                  )}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="max-w-[200px]">
              <div className="truncate font-medium text-ink" title={r.productName}>
                {r.productName}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              <span className="text-amber-500 font-semibold tracking-wider">{r.stars}</span>
              <span className="ml-1 text-xs text-muted">({r.rating})</span>
            </Table.Cell>
            <Table.Cell className="max-w-xs">
              <div className="line-clamp-2 text-sm text-ink/80" title={r.text}>
                {r.text || <span className="italic text-muted">—</span>}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-xs text-muted">
              {r.formattedDate}
            </Table.Cell>
            <Table.Cell onClick={(e) => e.stopPropagation()}>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={t("orders.details.viewDetails")}
                  onClick={() => onView(r)}
                  className="h-8 w-8 p-0 text-muted hover:text-ink"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <StatusMenu
                  options={options}
                  value={r.status}
                  onSelect={(st) => onStatus(r.id, st as ReviewStatusKey)}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

