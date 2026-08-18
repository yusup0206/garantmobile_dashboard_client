import type { FilterTab } from "@/components/common/FilterTabs";
import { money } from "@/lib/format";
import type { Promocode } from "@/services/promocodes/promocodes.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

// ---------------------------------------------------------------------------
// Status derivation: computed from isActive + date boundaries
// ---------------------------------------------------------------------------
export type PromoStatusKey = "active" | "scheduled" | "expired" | "inactive";

export function deriveStatus(p: Promocode): PromoStatusKey {
  if (!p.isActive) return "inactive";
  const now = Date.now();
  const start = new Date(p.startsAt).getTime();
  const end = new Date(p.expiresAt).getTime();
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export const PROMO_STATUS: Record<PromoStatusKey, StatusMeta> = {
  active: { labelKey: "status.promo.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  scheduled: { labelKey: "status.promo.scheduled", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  expired: { labelKey: "status.promo.expired", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
  inactive: { labelKey: "status.promo.inactive", fg: "#7a3f3f", bg: "#fdf0f0", dot: "#c95c5c" },
};

/** Human-readable discount label: "-20%" or "-50 m" */
export function discountLabel(p: Promocode): string {
  return p.discountType === "PERCENTAGE"
    ? `-${p.discountValue}%`
    : `-${money(p.discountValue)}`;
}

export type PromocodeRow = Promocode & {
  meta: StatusMeta;
  discount: string;
  usageFmt: string;
  status: PromoStatusKey;
};

export function toRow(p: Promocode): PromocodeRow {
  const status = deriveStatus(p);
  return {
    ...p,
    status,
    meta: PROMO_STATUS[status],
    discount: discountLabel(p),
    usageFmt: `${p.usedCount} / ${p.usageLimit}`,
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "promocodes.filter.active" },
  { key: "scheduled", label: "promocodes.filter.scheduled" },
  { key: "expired", label: "promocodes.filter.expired" },
  { key: "inactive", label: "promocodes.filter.inactive" },
];
