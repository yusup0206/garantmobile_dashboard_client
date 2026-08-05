import type { FilterTab } from "@/components/common/FilterTabs";
import type { TKey } from "@/i18n/dict";
import { fmt } from "@/lib/format";
import type {
  Banner,
  BannerOverlay,
  BannerPlacement,
  BannerStatusKey,
} from "@/services/banners/banners.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const BANNER_STATUS: Record<BannerStatusKey, StatusMeta> = {
  active: {
    labelKey: "status.banner.active",
    fg: "#1f6b49",
    bg: "#e9f4ee",
    dot: "#2f8b63",
  },
  paused: {
    labelKey: "status.banner.paused",
    fg: "#8a6d1f",
    bg: "#f8f1e0",
    dot: "#c79a34",
  },
  draft: {
    labelKey: "status.banner.draft",
    fg: "#6d7c74",
    bg: "#eef2f0",
    dot: "#9aa8a1",
  },
};

export const PLACEMENT_LABEL: Record<BannerPlacement, TKey> = {
  home: "Главная",
  category: "Категория",
  checkout: "Оформление",
};

export const OVERLAY_LABEL: Record<BannerOverlay, TKey> = {
  brand: "banners.overlay.brand",
  dark: "banners.overlay.dark",
};

export type BannerRow = Banner & {
  meta: StatusMeta;
  placementLabel: TKey;
  clicksFmt: string;
  scheduleLabel: string;
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
    !b.startsAt && !b.endsAt ? "—" : `${fmtDate(b.startsAt)} – ${fmtDate(b.endsAt)}`;
  return {
    ...b,
    meta: BANNER_STATUS[b.st],
    placementLabel: PLACEMENT_LABEL[b.placement],
    clicksFmt: fmt(b.clicks),
    scheduleLabel,
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "banners.filter.active" },
  { key: "paused", label: "banners.filter.paused" },
  { key: "draft", label: "banners.filter.draft" },
];
