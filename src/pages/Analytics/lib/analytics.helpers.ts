import type { AnalyticsMonth } from "@/services/analyticsBoard/analyticsBoard.types";

/** Height percent of a bar relative to the tallest month in the series. */
export function barHeight(value: number, max: number): string {
  return (max > 0 ? (value / max) * 100 : 0) + "%";
}

/** Largest monthly revenue value, used to scale the bars. */
export function maxMonthValue(months: AnalyticsMonth[]): number {
  return Math.max(...months.map((m) => m.value));
}
