import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { ANALYTICS_BOARD } from "@/data/analytics.mock";
import type { AnalyticsBoard } from "./analyticsBoard.types";

export function getBoard(): Promise<AnalyticsBoard> {
  if (isApiEnabled()) {
    return apiClient<AnalyticsBoard>("/analytics/board", { token: authToken() });
  }
  return mockDelay(ANALYTICS_BOARD);
}

