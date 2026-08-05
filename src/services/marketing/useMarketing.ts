import { useQuery } from "@tanstack/react-query";
import { getCampaigns, getMarketingSummary } from "./marketing.api";

export const marketingKeys = {
  campaigns: ["marketing", "campaigns"] as const,
  summary: ["marketing", "summary"] as const,
};

export function useCampaigns() {
  return useQuery({ queryKey: marketingKeys.campaigns, queryFn: getCampaigns });
}

export function useMarketingSummary() {
  return useQuery({ queryKey: marketingKeys.summary, queryFn: getMarketingSummary });
}
