import type { FilterTab } from "@/components/common/FilterTabs";
import { DELIVERY_STATUS } from "@/data/delivery.mock";
import type { Shipment } from "@/services/delivery/delivery.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type DeliveryRow = Shipment & {
  meta: StatusMeta;
};

export const STATUS_OPTIONS: StatusOption[] = (
  ["pending", "transit", "delivered", "failed"] as const
).map((key) => ({ key, meta: DELIVERY_STATUS[key] }));

export function toRow(s: Shipment): DeliveryRow {
  return {
    ...s,
    meta: DELIVERY_STATUS[s.st],
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "pending", label: "delivery.filter.pending" },
  { key: "transit", label: "delivery.filter.transit" },
  { key: "delivered", label: "delivery.filter.delivered" },
  { key: "failed", label: "delivery.filter.failed" },
];
