import { useQuery } from "@tanstack/react-query";
import { getPeriod, getTopProducts } from "./analytics.api";
import type { PeriodKey } from "./analytics.types";

export const analyticsKeys = {
  period: (p: PeriodKey) => ["analytics", "period", p] as const,
  top: ["analytics", "top"] as const,
};

export function usePeriod(period: PeriodKey) {
  return useQuery({
    queryKey: analyticsKeys.period(period),
    queryFn: () => getPeriod(period),
  });
}

export function useTopProducts() {
  return useQuery({ queryKey: analyticsKeys.top, queryFn: getTopProducts });
}
