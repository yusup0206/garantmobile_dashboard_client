import type { FilterTab } from "@/components/common/FilterTabs";
import { ORDER_STATUS, PRODUCT_NAMES } from "@/data/mock";
import { money } from "@/lib/format";
import type { Order } from "@/services/orders/orders.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type OrderRow = Order & {
  meta: StatusMeta;
  productLabel: string;
  count: number;
  totalFmt: string;
};

export function toRow(o: Order): OrderRow {
  const names = o.ids.map((id) => PRODUCT_NAMES[id]).filter(Boolean);
  return {
    ...o,
    meta: ORDER_STATUS[o.st],
    productLabel: names.join(", ") || "—",
    count: names.length,
    totalFmt: money(o.total),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "proc", label: "orders.filter.proc" },
  { key: "done", label: "orders.filter.done" },
  { key: "cancel", label: "orders.filter.cancel" },
];

export const STATUS_OPTIONS: StatusOption[] = (["proc", "done", "cancel"] as const).map(
  (key) => ({ key, meta: ORDER_STATUS[key] }),
);
