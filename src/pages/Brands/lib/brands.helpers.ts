import { initials } from "@/lib/format";
import type { Brand } from "@/services/brands/brands.types";

export type BrandView = Brand & {
  initials: string;
};

export function toView(brand: Brand): BrandView {
  return {
    ...brand,
    initials: initials(brand.name),
  };
}
