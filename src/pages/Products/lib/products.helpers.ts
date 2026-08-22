import type { FilterTab } from "@/components/common/FilterTabs";
import { fmt, money } from "@/lib/format";
import type { Product } from "@/services/products/products.types";

export type ProductRow = Product & {
  displayName: string;
  priceFmt: string;
  oldPriceFmt: string;
  stockFmt: string;
};

export function toRow(p: Product): ProductRow {
  return {
    ...p,
    displayName: p.nameRu || p.nameTk,
    priceFmt: money(p.price),
    oldPriceFmt: p.oldPrice > 0 ? money(p.oldPrice) : "",
    stockFmt: p.stock > 0 ? fmt(p.stock) + " шт" : "—",
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
];
