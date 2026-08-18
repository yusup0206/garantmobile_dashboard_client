export type ProductSpec = {
  id: string;
  productId: string;
  specId: string;
  specValueId: string;
  sortOrder: number;
};

export type ProductSpecInput = {
  productId: string;
  specValueId: string;
  sortOrder: number;
};

export type GetProductSpecsParams = {
  page?: number;
  pageSize?: number;
  productId?: string;
  specId?: string;
  specValueId?: string;
};

export type GetProductSpecsResponse = {
  count: number;
  specs: ProductSpec[];
};
