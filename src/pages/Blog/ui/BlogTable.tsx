import { Pencil, Trash2, Clock, Tag } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
import type { BlogRow } from "../lib/blog.helpers";

type BlogTableProps = {
  rows: BlogRow[];
  onEdit: (row: BlogRow) => void;
  onDelete: (row: BlogRow) => void;
};

export function BlogTable({ rows, onEdit, onDelete }: BlogTableProps) {
  const t = useT();

  return (
    <Table containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.heading")}</Table.Head>
          <Table.Head>Тег</Table.Head>
          <Table.Head>{t("form.date")}</Table.Head>
          <Table.Head className="text-right">Время чтения</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="max-w-xs">
              <div className="flex items-center gap-3">
                {r.cover ? (
                  <img
                    src={r.cover}
                    alt={r.titleRu || r.titleTk}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover border border-line"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-ink">
                    {r.titleRu || r.titleTk}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {r.teaserRu || r.teaserTk || r.titleTk}
                  </p>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.tag ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs border border-line/60 font-medium">
                  <Tag className="h-3 w-3" />
                  {r.tag.nameRu || r.tag.nameTk}
                </span>
              ) : (
                "—"
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "—"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted" />
                {r.readingTime ?? 0} мин
              </span>
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
                  aria-label={"Редактировать " + (r.titleRu || r.titleTk)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(r)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={"Удалить " + (r.titleRu || r.titleTk)}
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
