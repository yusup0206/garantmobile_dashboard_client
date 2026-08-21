import type { FilterTab } from "@/components/common/FilterTabs";
import { ORDER_STATUS } from "@/data/mock";
import { money } from "@/lib/format";
import type { Order, OrderStatusKey } from "@/services/orders/orders.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type OrderRow = Order & {
  meta: StatusMeta;
  productLabel: string;
  count: number;
  totalFmt: string;
  customerName: string;
  customerPhone: string;
  formattedDate: string;
};

export function toRow(o: Order, lang = "ru"): OrderRow {
  const itemNames = (o.items ?? []).map((item) =>
    lang === "en"
      ? item.productNameRu || item.productNameTk
      : item.productNameRu || item.productNameTk,
  );

  const itemCount = (o.items ?? []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const productLabel = itemNames.length > 0 ? itemNames.join(", ") : "—";

  const numTotal = Number(o.total) || 0;

  let formattedDate = o.created;
  try {
    const d = new Date(o.created);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    // Keep fallback
  }

  const meta = ORDER_STATUS[o.status] ?? {
    labelKey: "status.order.pending",
    fg: "#6b7280",
    bg: "#f3f4f6",
    dot: "#9ca3af",
  };

  return {
    ...o,
    meta,
    productLabel,
    count: itemCount,
    totalFmt: money(numTotal, lang === "en" ? "en" : "ru"),
    customerName: o.customer?.name || o.recipientName || "—",
    customerPhone: o.customer?.phone || o.recipientPhone || "—",
    formattedDate,
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "orders.filter.all" },
  { key: "pending", label: "orders.filter.pending" },
  { key: "confirmed", label: "orders.filter.confirmed" },
  { key: "processing", label: "orders.filter.processing" },
  { key: "shipped", label: "orders.filter.shipped" },
  { key: "delivered", label: "orders.filter.delivered" },
  { key: "cancelled", label: "orders.filter.cancelled" },
];

export const STATUS_OPTIONS: StatusOption[] = (
  [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ] as OrderStatusKey[]
).map((key) => ({ key, meta: ORDER_STATUS[key] }));
