import type { Category, CategoryStatus } from "@/services/categories/categories.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const CATEGORY_STATUS: Record<CategoryStatus, StatusMeta> = {
  active: { labelKey: "status.category.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  hidden: { labelKey: "status.category.hidden", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export type CategoryView = Category & {
  meta: StatusMeta;
};

export function toView(item: Category): CategoryView {
  return {
    ...item,
    meta: CATEGORY_STATUS[item.st],
  };
}
