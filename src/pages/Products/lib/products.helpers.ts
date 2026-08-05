import type { FilterTab } from "@/components/common/FilterTabs";
import { PRODUCT_STATUS } from "@/data/products.mock";
import { fmt, money } from "@/lib/format";
import type { Product } from "@/services/products/products.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export type ProductRow = Product & {
  meta: StatusMeta;
  priceFmt: string;
  stockFmt: string;
};

export function toRow(p: Product): ProductRow {
  return {
    ...p,
    meta: PRODUCT_STATUS[p.st],
    priceFmt: money(p.price),
    stockFmt: p.stock > 0 ? fmt(p.stock) + " шт" : "—",
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "products.filter.active" },
  { key: "draft", label: "products.filter.draft" },
  { key: "archived", label: "products.filter.archived" },
];
