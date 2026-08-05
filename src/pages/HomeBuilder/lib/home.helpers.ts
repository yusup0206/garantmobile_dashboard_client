import type { TKey } from "@/i18n/dict";
import {
  HOME_BLOCK_KINDS,
  type HomeBlock,
  type HomeBlockKind,
} from "@/services/home/home.types";

/** Человекочитаемые названия видов блоков (ключи словаря). */
export const KIND_LABEL: Record<HomeBlockKind, TKey> = {
  hero: "home.kind.hero",
  category_grid: "home.kind.category_grid",
  product_rail: "home.kind.product_rail",
  sale_week: "home.kind.sale_week",
  bundles: "home.kind.bundles",
  banners: "home.kind.banners",
  benefits: "home.kind.benefits",
  tradein_cta: "home.kind.tradein_cta",
  brands: "home.kind.brands",
  selection_chips: "home.kind.selection_chips",
  newsletter: "home.kind.newsletter",
  preorder_promo: "home.kind.preorder_promo",
  blog_teasers: "home.kind.blog_teasers",
  faq: "home.kind.faq",
  custom: "home.kind.custom",
};

export const ALL_KINDS: readonly HomeBlockKind[] = HOME_BLOCK_KINDS;

/**
 * Переставляет блок вверх/вниз и перенумеровывает `order` 1..n (ADR-003) —
 * непрерывность порядка получается по построению.
 */
export function move(blocks: HomeBlock[], id: number, dir: -1 | 1): HomeBlock[] {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const i = sorted.findIndex((b) => b.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= sorted.length) return blocks;
  const a = sorted[i];
  const b = sorted[j];
  sorted[i] = b;
  sorted[j] = a;
  return sorted.map((block, idx) => ({ ...block, order: idx + 1 }));
}

/** Разумные дефолтные `props` для нового блока каждого вида. */
export function defaultProps(kind: HomeBlockKind): Record<string, unknown> {
  switch (kind) {
    case "product_rail":
      return { source: "new", limit: 4 };
    case "sale_week":
      return { source: "sale", limit: 4, endsAt: null };
    case "banners":
      return { placement: "home", limit: 5 };
    case "benefits":
      return { variant: "grid" };
    case "brands":
      return { variant: "logos", limit: 8 };
    case "blog_teasers":
      return { limit: 3 };
    case "selection_chips":
      return { items: [] };
    default:
      return {};
  }
}

let tempId = -1;

/** Создаёт новый блок с временным (отрицательным) id — бэкенд выдаст реальный. */
export function newBlock(kind: HomeBlockKind, order: number): HomeBlock {
  return {
    id: tempId--,
    kind,
    order,
    visible: true,
    title: { ru: "", tm: "" },
    subtitle: { ru: "", tm: "" },
    categoryId: null,
    categorySlug: null,
    props: defaultProps(kind),
  };
}
