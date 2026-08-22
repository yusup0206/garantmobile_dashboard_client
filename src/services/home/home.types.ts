/** Контракт главной страницы (ADR-001) — копия, идентичная бэкенду и витрине.
 *  Изменения только аддитивные; ломающее изменение → HOME_LAYOUT_VERSION: 2. */

export type Localized = { ru: string; tm: string };

export const HOME_LAYOUT_VERSION = 1;

/** Виды блоков между статичными Header и Footer. */
export const HOME_BLOCK_KINDS = [
  "hero",
  "category_grid",
  "product_rail",
  "sale_week",
  "bundles",
  "banners",
  "benefits",
  "tradein_cta",
  "brands",
  "selection_chips",
  "newsletter",
  "preorder_promo",
  "blog_teasers",
  "faq",
  "custom",
] as const;
export type HomeBlockKind = (typeof HOME_BLOCK_KINDS)[number];

export type HomeBlock = {
  id: number;
  kind: HomeBlockKind;
  order: number;
  visible: boolean;
  title: Localized;
  subtitle: Localized;
  categoryId: number | null;
  categorySlug: string | null;
  props: Record<string, unknown>;
};

export type HomeLayout = {
  version: number;
  blocks: HomeBlock[];
};

/** Полезная нагрузка сохранения — как её ждёт PUT /home-layout бэкенда. */
export type HomeBlockInput = {
  id?: number;
  kind: HomeBlockKind;
  visible: boolean;
  title?: string;
  titleTk?: string;
  subtitle?: string;
  subtitleTk?: string;
  categoryId?: number | null;
  props?: Record<string, unknown>;
};

const empty: Localized = { ru: "", tm: "" };

const defaults: Array<Pick<HomeBlock, "kind" | "props">> = [
  { kind: "hero", props: {} },
  { kind: "category_grid", props: {} },
  { kind: "product_rail", props: { source: "new", limit: 4 } },
  { kind: "sale_week", props: { source: "sale", limit: 4, endsAt: null } },
  { kind: "product_rail", props: { source: "top_rated", limit: 4, boxed: true } },
  { kind: "bundles", props: {} },
  { kind: "banners", props: { placement: "home", limit: 5 } },
  { kind: "benefits", props: { variant: "grid" } },
  {
    kind: "product_rail",
    props: { source: "category", categorySlug: "accessories", limit: 4, boxed: true },
  },
  { kind: "tradein_cta", props: {} },
  { kind: "brands", props: { variant: "logos", limit: 8 } },
  { kind: "product_rail", props: { source: "recent", limit: 4 } },
  { kind: "blog_teasers", props: { limit: 3 } },
  { kind: "selection_chips", props: { items: [] } },
  { kind: "newsletter", props: {} },
];

/** Дефолтная композиция (зеркало бэкенда) — стартовое состояние конструктора. */
export const DEFAULT_LAYOUT: HomeLayout = {
  version: HOME_LAYOUT_VERSION,
  blocks: defaults.map((block, index) => ({
    id: index + 1,
    kind: block.kind,
    order: index + 1,
    visible: true,
    title: empty,
    subtitle: empty,
    categoryId: null,
    categorySlug: null,
    props: block.props,
  })),
};
