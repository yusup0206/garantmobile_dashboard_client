import type { FilterTab } from "@/components/common/FilterTabs";
import type { PaymentType } from "@/services/payments/payments.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export type PaymentRow = PaymentType & {
  statusMeta: StatusMeta;
  activeText: string;
};

export function toRow(pt: PaymentType): PaymentRow {
  const active = String(pt.isActive) === "true";
  return {
    ...pt,
    statusMeta: active
      ? { labelKey: "status.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" }
      : { labelKey: "status.inactive", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
    activeText: active ? "Активен" : "Неактивен",
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "status.active" },
  { key: "inactive", label: "status.inactive" },
];
