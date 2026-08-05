import type { FilterTab } from "@/components/common/FilterTabs";
import { fmt, money } from "@/lib/format";
import type { Promocode, PromoStatusKey } from "@/services/promocodes/promocodes.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const PROMO_STATUS: Record<PromoStatusKey, StatusMeta> = {
  active: { labelKey: "status.promo.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  scheduled: { labelKey: "status.promo.scheduled", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  expired: { labelKey: "status.promo.expired", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

/** Human-readable discount: "-15%" for percent, "-5 000 m" for fixed amount. */
export function discountLabel(p: Promocode): string {
  return p.kind === "percent" ? "-" + p.value + "%" : "-" + money(p.value);
}

export type PromocodeRow = Promocode & {
  meta: StatusMeta;
  discount: string;
  usageFmt: string;
};

export function toRow(p: Promocode): PromocodeRow {
  return {
    ...p,
    meta: PROMO_STATUS[p.st],
    discount: discountLabel(p),
    usageFmt: fmt(p.used) + " / " + fmt(p.limit),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "promocodes.filter.active" },
  { key: "scheduled", label: "promocodes.filter.scheduled" },
  { key: "expired", label: "promocodes.filter.expired" },
];
