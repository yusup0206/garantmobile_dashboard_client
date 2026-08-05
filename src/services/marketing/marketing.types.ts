export type CampaignChannel = "promo" | "banner" | "push";

export type CampaignStatusKey = "active" | "scheduled" | "finished";

export type Campaign = {
  id: string;
  name: string;
  channel: CampaignChannel;
  period: string;
  reach: number;
  st: CampaignStatusKey;
};

export type MarketingSummary = {
  active: number;
  reach: number;
  revenue: number;
  conversion: number;
};
