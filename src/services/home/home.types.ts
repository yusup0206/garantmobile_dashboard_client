export const HOME_BLOCK_KINDS = [
  "hero",
  "categories",
  "products",
  "product_sets",
  "banners",
  "brands",
  "blog",
  "trade_in",
] as const;

export type HomeBlockKind = (typeof HOME_BLOCK_KINDS)[number];

export type HomeBlockStatus = "active" | "hidden";

export type ProductSource =
  | "newest"
  | "popular"
  | "recommended"
  | "category"
  | "manual"
  | string;

export type HomeBlock = {
  id: string;
  kind: HomeBlockKind;
  titleRu: string;
  titleTk: string;
  subtitleRu?: string | null;
  subtitleTk?: string | null;
  categoryId?: string | null;
  productSource?: string | null;
  itemsLimit?: number | null;
  sortOrder: number;
  status: HomeBlockStatus;
  created?: string;
  updated?: string;
  category?: {
    id: string;
    nameRu?: string;
    nameTk?: string;
    slug?: string;
  } | null;
  productSets?: Array<{
    id: string;
    homeBlockId: string;
    productSetId: string;
    sortOrder: number;
    productSet?: any;
  }> | null;
};

export type GetHomeBlocksParams = {
  kind?: HomeBlockKind;
  status?: HomeBlockStatus;
  search?: string;
};

export type GetHomeBlocksResponse = {
  count: number;
  blocks: HomeBlock[];
};

export type CreateHomeBlockInput = {
  kind: HomeBlockKind;
  titleRu: string;
  titleTk: string;
  subtitleRu?: string;
  subtitleTk?: string;
  categoryId?: string | null;
  productSource?: string | null;
  itemsLimit?: number | null;
  status?: HomeBlockStatus;
};

export type UpdateHomeBlockInput = {
  titleRu?: string;
  titleTk?: string;
  subtitleRu?: string | null;
  subtitleTk?: string | null;
  categoryId?: string | null;
  productSource?: string | null;
  itemsLimit?: number | null;
  status?: HomeBlockStatus;
};

export type ReorderHomeBlocksInput = {
  blockIds: string[];
};
