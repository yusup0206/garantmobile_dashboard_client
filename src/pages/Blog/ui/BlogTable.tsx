import { Pencil, Trash2, Clock, Tag } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { BlogRow } from "../lib/blog.helpers";

type BlogTableProps = {
  rows: BlogRow[];
  onEdit: (row: BlogRow) => void;
  onDelete: (row: BlogRow) => void;
};

export function BlogTable({ rows, onEdit, onDelete }: BlogTableProps) {
  const t = useT();

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.heading")}</th>
            <th className="px-5 py-3 font-semibold">Тег</th>
            <th className="px-5 py-3 font-semibold">{t("form.date")}</th>
            <th className="px-5 py-3 text-right font-semibold">Время чтения</th>
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
              <td className="max-w-xs px-5 py-3.5">
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
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.tag ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-xs border border-line/60 font-medium">
                    <Tag className="h-3 w-3" />
                    {r.tag.nameRu || r.tag.nameTk}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted" />
                  {r.readingTime ?? 0} мин
                </span>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
