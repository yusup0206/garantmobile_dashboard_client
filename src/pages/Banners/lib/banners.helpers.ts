import type { FilterTab } from "@/components/common/FilterTabs";
import type { Banner, BannerPlacement, BannerLinkType } from "@/services/banners/banners.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const ACTIVE_META: StatusMeta = {
  labelKey: "status.banner.active",
  fg: "#1f6b49",
  bg: "#e9f4ee",
  dot: "#2f8b63",
};

export const INACTIVE_META: StatusMeta = {
  labelKey: "status.banner.paused",
  fg: "#8a6d1f",
  bg: "#f8f1e0",
  dot: "#c79a34",
};

export const PLACEMENT_LABEL: Record<BannerPlacement, string> = {
  main_slider: "Главный слайдер",
  side_top: "Боковой (верх)",
  side_bottom: "Боковой (низ)",
  grid_left: "Сетка (лево)",
  grid_right: "Сетка (право)",
  trade_in: "Trade-in",
};

export const LINK_TYPE_LABEL: Record<BannerLinkType, string> = {
  product: "Товар",
  category: "Категория",
  tradein: "Trade-in",
  external_link: "Внешняя ссылка",
  offers: "Акции",
};

export type BannerRow = Banner & {
  meta: StatusMeta;
  placementLabel: string;
  linkTypeLabel: string;
  scheduleLabel: string;
  displayTitle: string;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "∞";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

export function toRow(b: Banner): BannerRow {
  const scheduleLabel =
    !b.startDate && !b.endDate
      ? "—"
      : `${fmtDate(b.startDate)} – ${fmtDate(b.endDate)}`;
  return {
    ...b,
    meta: b.isActive ? ACTIVE_META : INACTIVE_META,
    placementLabel: PLACEMENT_LABEL[b.placement] ?? b.placement,
    linkTypeLabel: LINK_TYPE_LABEL[b.linkType] ?? b.linkType,
    scheduleLabel,
    displayTitle: b.titleRu || b.titleTk || "—",
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "banners.filter.active" },
  { key: "inactive", label: "banners.filter.paused" },
];

export const PLACEMENTS: BannerPlacement[] = [
  "main_slider",
  "side_top",
  "side_bottom",
  "grid_left",
  "grid_right",
  "trade_in",
];

export const LINK_TYPES: BannerLinkType[] = [
  "product",
  "category",
  "tradein",
  "external_link",
  "offers",
];
