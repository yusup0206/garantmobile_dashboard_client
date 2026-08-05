import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { CAMPAIGNS, MARKETING_SUMMARY } from "@/data/marketing.mock";
import type { Campaign, MarketingSummary } from "./marketing.types";

export function getCampaigns(): Promise<Campaign[]> {
  if (isApiEnabled()) {
    return apiClient<Campaign[]>("/marketing/campaigns", { token: authToken() });
  }
  return mockDelay(CAMPAIGNS);
}

export function getMarketingSummary(): Promise<MarketingSummary> {
  if (isApiEnabled()) {
    return apiClient<MarketingSummary>("/marketing/summary", { token: authToken() });
  }
  return mockDelay(MARKETING_SUMMARY, 250);
}

