import type { FilterTab } from "@/components/common/FilterTabs";
import type { TKey } from "@/i18n/dict";
import type {
  Campaign,
  CampaignChannel,
  CampaignStatusKey,
} from "@/services/marketing/marketing.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const CAMPAIGN_STATUS: Record<CampaignStatusKey, StatusMeta> = {
  active: { labelKey: "status.campaign.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  scheduled: { labelKey: "status.campaign.scheduled", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  finished: { labelKey: "status.campaign.finished", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export const CHANNEL_LABEL: Record<CampaignChannel, TKey> = {
  promo: "Акция",
  banner: "Баннер",
  push: "Push",
};

export type CampaignRow = Campaign & {
  meta: StatusMeta;
  channelLabel: TKey;
};

export function toRow(c: Campaign): CampaignRow {
  return {
    ...c,
    meta: CAMPAIGN_STATUS[c.st],
    channelLabel: CHANNEL_LABEL[c.channel],
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "marketing.filter.active" },
  { key: "scheduled", label: "marketing.filter.scheduled" },
  { key: "finished", label: "marketing.filter.finished" },
];
