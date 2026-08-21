import { initials } from "@/lib/format";
import type { Customer, CustomerTier } from "@/services/customers/customers.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { FilterTab } from "@/components/common/FilterTabs";

export const TIER_META: Record<CustomerTier, StatusMeta> = {
  vip: { labelKey: "status.tier.vip", fg: "#6b3fa0", bg: "#f1ecfa", dot: "#8b5cf6" },
  active: { labelKey: "status.tier.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  new: { labelKey: "status.tier.new", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
};

export const BLOCKED_META: { active: StatusMeta; blocked: StatusMeta } = {
  active: { labelKey: "cust.status.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  blocked: { labelKey: "cust.status.blocked", fg: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "createdDate", label: "cust.filter.createdDate" },
  { key: "orderCount", label: "cust.filter.orderCount" },
  { key: "bonusBalance", label: "cust.filter.bonusBalance" },
  { key: "repeatCustomers", label: "cust.filter.repeatCustomers" },
  { key: "newsForMonth", label: "cust.filter.newsForMonth" },
];

export type CustomerRow = Customer & {
  tierMeta: StatusMeta;
  statusMeta: StatusMeta;
  initials: string;
};

export function toRow(c: Customer): CustomerRow {
  return {
    ...c,
    tierMeta: TIER_META[c.tier] ?? TIER_META.active,
    statusMeta: c.isBlocked ? BLOCKED_META.blocked : BLOCKED_META.active,
    initials: initials(c.name || c.phone || "?"),
  };
}

/** Case-insensitive match over name, phone, email and city. */
export function matches(c: Customer, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    (c.name ?? "").toLowerCase().includes(q) ||
    (c.phone ?? "").toLowerCase().includes(q) ||
    (c.email ?? "").toLowerCase().includes(q) ||
    (c.city ?? "").toLowerCase().includes(q)
  );
}
