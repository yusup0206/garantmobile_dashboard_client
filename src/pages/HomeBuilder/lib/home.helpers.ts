import type { TKey } from "@/i18n/dict";
import {
  HOME_BLOCK_KINDS,
  type HomeBlock,
  type HomeBlockKind,
  type CreateHomeBlockInput,
} from "@/services/home/home.types";

/** Человекочитаемые названия видов блоков (ключи словаря). */
export const KIND_LABEL: Record<HomeBlockKind, TKey> = {
  hero: "home.kind.hero",
  categories: "home.kind.category_grid",
  products: "home.kind.product_rail",
  product_sets: "home.kind.bundles",
  banners: "home.kind.banners",
  brands: "home.kind.brands",
  blog: "home.kind.blog_teasers",
  trade_in: "home.kind.tradein_cta",
};

export const ALL_KINDS: readonly HomeBlockKind[] = HOME_BLOCK_KINDS;

/** Default limits / presets per kind */
export function defaultItemsLimit(kind: HomeBlockKind): number | undefined {
  switch (kind) {
    case "hero":
      return 6;
    case "categories":
      return 8;
    case "products":
      return 8;
    case "product_sets":
      return 3;
    case "banners":
      return 4;
    case "brands":
      return 8;
    case "blog":
      return 3;
    default:
      return undefined;
  }
}

/** Default product source for "products" kind */
export const PRODUCT_SOURCES = [
  { value: "newest", labelKey: "home.source.new" },
  { value: "popular", labelKey: "home.source.popular" },
  { value: "recommended", labelKey: "home.source.recommended" },
  { value: "category", labelKey: "home.source.category" },
  { value: "manual", labelKey: "home.source.manual" },
] as const;

/**
 * Helper to create default form state for adding a block
 */
export function newBlockInput(kind: HomeBlockKind = "products"): CreateHomeBlockInput {
  return {
    kind,
    titleRu: "",
    titleTk: "",
    subtitleRu: "",
    subtitleTk: "",
    itemsLimit: defaultItemsLimit(kind),
    productSource: kind === "products" ? "newest" : undefined,
    categoryId: undefined,
    status: "active",
  };
}
