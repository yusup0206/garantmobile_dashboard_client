import { useEffect, useMemo, useState } from "react";

export type Pagination<T> = {
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  slice: T[];
  total: number;
  pageSize: number;
};

/**
 * Client-side pagination for an in-memory list. Pass `resetKey` (e.g. the
 * active filter) to jump back to page 1 whenever the underlying set changes.
 */
export function usePagination<T>(
  items: T[],
  pageSize: number,
  resetKey?: unknown,
): Pagination<T> {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Clamp when the list shrinks below the current page.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const slice = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { page, setPage, pageCount, slice, total: items.length, pageSize };
}
