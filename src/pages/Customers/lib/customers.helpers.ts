import { money, initials } from "@/lib/format";
import type { Customer, CustomerTier } from "@/services/customers/customers.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const TIER_META: Record<CustomerTier, StatusMeta> = {
  vip: { labelKey: "status.tier.vip", fg: "#6b3fa0", bg: "#f1ecfa", dot: "#8b5cf6" },
  active: { labelKey: "status.tier.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  new: { labelKey: "status.tier.new", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
};

export type CustomerRow = Customer & {
  meta: StatusMeta;
  initials: string;
  spentFmt: string;
};

export function toRow(c: Customer): CustomerRow {
  return {
    ...c,
    meta: TIER_META[c.tier],
    initials: initials(c.name),
    spentFmt: money(c.spent),
  };
}

/** Case-insensitive match over name and city. */
export function matches(c: Customer, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
}
