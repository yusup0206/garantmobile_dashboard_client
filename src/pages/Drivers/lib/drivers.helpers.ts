import type { FilterTab } from "@/components/common/FilterTabs";
import { initials } from "@/lib/format";
import type { Driver, DriverStatusKey } from "@/services/drivers/drivers.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const DRIVER_STATUS: Record<DriverStatusKey, StatusMeta> = {
  online: { labelKey: "status.driver.online", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  busy: { labelKey: "status.driver.busy", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  offline: { labelKey: "status.driver.offline", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export type DriverRow = Driver & {
  meta: StatusMeta;
  initials: string;
};

export function toRow(d: Driver): DriverRow {
  return {
    ...d,
    meta: DRIVER_STATUS[d.st],
    initials: initials(d.name),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "online", label: "drivers.filter.online" },
  { key: "busy", label: "drivers.filter.busy" },
  { key: "offline", label: "drivers.filter.offline" },
];
