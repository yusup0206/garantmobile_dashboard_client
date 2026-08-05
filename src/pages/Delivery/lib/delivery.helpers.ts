import type { FilterTab } from "@/components/common/FilterTabs";
import type { DeliveryType } from "@/services/delivery/delivery.types";

export type DeliveryRow = DeliveryType;

export function toRow(d: DeliveryType): DeliveryRow {
  return { ...d };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "banners.filter.active" },
  { key: "inactive", label: "banners.filter.paused" },
];
