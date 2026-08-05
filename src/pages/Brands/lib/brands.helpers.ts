import { initials } from "@/lib/format";
import type { Brand, BrandStatus } from "@/services/brands/brands.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const BRAND_STATUS: Record<BrandStatus, StatusMeta> = {
  active: { labelKey: "status.brand.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  inactive: { labelKey: "status.brand.inactive", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export type BrandView = Brand & {
  initials: string;
  meta: StatusMeta;
};

export function toView(brand: Brand): BrandView {
  return {
    ...brand,
    initials: initials(brand.name),
    meta: BRAND_STATUS[brand.st],
  };
}
