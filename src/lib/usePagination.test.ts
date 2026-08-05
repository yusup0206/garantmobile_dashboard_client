import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

const items = Array.from({ length: 14 }, (_, i) => i + 1);

describe("usePagination", () => {
  it("slices the first page and reports the page count", () => {
    const { result } = renderHook(() => usePagination(items, 8));
    expect(result.current.pageCount).toBe(2);
    expect(result.current.total).toBe(14);
    expect(result.current.slice).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("returns the tail on the last page", () => {
    const { result } = renderHook(() => usePagination(items, 8));
    act(() => result.current.setPage(2));
    expect(result.current.slice).toEqual([9, 10, 11, 12, 13, 14]);
  });

  it("resets to page 1 when the reset key changes", () => {
    const { result, rerender } = renderHook(
      ({ key }: { key: string }) => usePagination(items, 8, key),
      { initialProps: { key: "a" } },
    );
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    rerender({ key: "b" });
    expect(result.current.page).toBe(1);
  });

  it("keeps a single page for short lists", () => {
    const { result } = renderHook(() => usePagination([1, 2, 3], 8));
    expect(result.current.pageCount).toBe(1);
    expect(result.current.slice).toEqual([1, 2, 3]);
  });
});
