import type { Brand } from "@/services/brands/brands.types";
import type { Category } from "@/services/categories/categories.types";
import type { Product } from "@/services/products/products.types";
import type { ProductVariant } from "@/services/productVariants/productVariants.types";

/**
 * 1. Preorder Tag Types
 */
export type PreorderTag = {
  id: string;
  nameTk: string;
  nameRu: string;
};

export type PreorderTagInput = {
  nameTk: string;
  nameRu: string;
};

export type GetPreorderTagsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  lang?: string;
};

export type GetPreorderTagsResponse = {
  count: number;
  preorderTags: PreorderTag[];
};

export type DeletePreorderTagResponse = {
  deleted: boolean;
};

/**
 * 2. Preorder Item Types
 */
export type PreorderItem = {
  id: string;
  titleTk: string;
  titleRu: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  tagId: string;
  tag?: PreorderTag;
  productId: string;
  product?: Product;
  variantId: string;
  variant?: ProductVariant;
  releaseDate: string;
  targetSize: number;
  waitingCount: number;
};

export type PreorderInput = {
  titleTk: string;
  titleRu: string;
  brandId: string;
  categoryId: string;
  tagId: string;
  productId: string;
  variantId: string;
  releaseDate: string;
  targetSize: number;
};

export type GetPreordersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
  tagId?: string;
  productId?: string;
  lang?: string;
};

export type GetPreordersResponse = {
  count: number;
  preorders: PreorderItem[];
};

export type DeletePreorderResponse = {
  deleted: boolean;
};

/**
 * 3. Preorder Request Types
 */
export type PreorderRequestStatus =
  | "new"
  | "prepay"
  | "ready"
  | "done"
  | "rejected";

export type PreorderCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type PreorderRequestItem = {
  id: string;
  seq: number;
  preorderId: string;
  customerId: string;
  customer?: PreorderCustomer;
  preorder?: PreorderItem;
  depositPercent: number;
  depositAmount: number;
  total: number;
  status: PreorderRequestStatus;
  created: string;
};

export type GetPreorderRequestsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PreorderRequestStatus;
  preorderId?: string;
  customerId?: string;
  lang?: string;
};

export type GetPreorderRequestsResponse = {
  count: number;
  preorderRequests: PreorderRequestItem[];
};

// Backward-compatibility legacy types (if needed by mock data or imports)
export type PreorderStatusKey = "new" | "prepay" | "ready" | "done" | "rejected";
export type Preorder = {
  num: string;
  date: string;
  product: string;
  customer: string;
  prepay: number;
  total: number;
  st: PreorderStatusKey;
};
