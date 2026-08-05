import type { FilterTab } from "@/components/common/FilterTabs";
import type {
  WarrantyClaim,
  WarrantyStatusKey,
} from "@/services/warranty/warranty.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export const WARRANTY_STATUS: Record<WarrantyStatusKey, StatusMeta> = {
  new: { labelKey: "status.warranty.new", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  service: { labelKey: "status.warranty.service", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  resolved: { labelKey: "status.warranty.resolved", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  rejected: { labelKey: "status.warranty.rejected", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export type WarrantyRow = WarrantyClaim & { meta: StatusMeta };

export function toRow(claim: WarrantyClaim): WarrantyRow {
  return { ...claim, meta: WARRANTY_STATUS[claim.st] };
}

export const STATUS_OPTIONS: StatusOption[] = (
  ["new", "service", "resolved", "rejected"] as const
).map((key) => ({ key, meta: WARRANTY_STATUS[key] }));

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "new", label: "warranty.filter.new" },
  { key: "service", label: "warranty.filter.service" },
  { key: "resolved", label: "warranty.filter.resolved" },
  { key: "rejected", label: "warranty.filter.rejected" },
];
