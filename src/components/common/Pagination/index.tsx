import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
};

/** Compact pager for client-side paginated tables. Hidden when there is one page. */
export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: PaginationProps) {
  const t = useT();
  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const arrow =
    "grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted">{t("common.showing", { from, to, total })}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={cn(arrow)}
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label={t("common.prevPage")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 font-semibold text-ink">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          className={cn(arrow)}
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          aria-label={t("common.nextPage")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
