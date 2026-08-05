import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { PERIODS, TOP_PRODUCTS } from "@/data/mock";
import type { PeriodData, PeriodKey, TopProduct } from "./analytics.types";

export function getPeriod(period: PeriodKey): Promise<PeriodData> {
  if (isApiEnabled()) {
    return apiClient<PeriodData>(`/analytics/period?period=${period}`, { token: authToken() });
  }
  return mockDelay(PERIODS[period]);
}

export function getTopProducts(): Promise<TopProduct[]> {
  if (isApiEnabled()) {
    return apiClient<TopProduct[]>("/analytics/top-products", { token: authToken() });
  }
  return mockDelay(TOP_PRODUCTS);
}

