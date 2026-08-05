import { CATEGORY_LABELS } from "@/data/catalog.mock";
import { money } from "@/lib/format";
import type { CatalogItem } from "@/services/catalog/catalog.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { TKey } from "@/i18n/dict";

export type StockLevel = "in" | "low" | "out";

export const STOCK_META: Record<StockLevel, StatusMeta> = {
  in: { labelKey: "status.stock.in", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  low: { labelKey: "status.stock.low", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  out: { labelKey: "status.stock.out", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

/** Low-stock threshold — items at or below this (but > 0) are "заканчивается". */
export const LOW_STOCK = 5;

export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "in";
}

export type CatalogRow = CatalogItem & {
  categoryLabel: TKey;
  priceFmt: string;
  level: StockLevel;
  meta: StatusMeta;
};

export function toRow(item: CatalogItem): CatalogRow {
  const level = stockLevel(item.stock);
  return {
    ...item,
    categoryLabel: CATEGORY_LABELS[item.cat] ?? (item.cat as TKey),
    priceFmt: money(item.price),
    level,
    meta: STOCK_META[level],
  };
}
