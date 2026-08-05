import type { FilterTab } from "@/components/common/FilterTabs";
import { fmt } from "@/lib/format";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { HeroSlide } from "@/services/heroSlides/heroSlides.types";

export const HERO_STATUS: Record<"on" | "off", StatusMeta> = {
  on: { labelKey: "status.hero.on", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  off: { labelKey: "status.hero.off", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export type HeroSlideRow = HeroSlide & {
  meta: StatusMeta;
  priceFmt: string;
};

export function toRow(s: HeroSlide): HeroSlideRow {
  return {
    ...s,
    meta: HERO_STATUS[s.active ? "on" : "off"],
    priceFmt: s.price != null ? fmt(s.price) : "—",
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "on", label: "hero.filter.on" },
  { key: "off", label: "hero.filter.off" },
];
