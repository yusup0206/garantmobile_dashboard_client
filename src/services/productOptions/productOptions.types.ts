export type ProductOption = {
  id: string;
  productId: string;
  nameRu: string;
  nameTm: string;
  sortOrder: number;
};

export type ProductOptionInput = {
  productId: string;
  nameRu: string;
  nameTm: string;
  sortOrder: number;
};

export type GetProductOptionsParams = {
  page?: number;
  pageSize?: number;
  productId?: string;
};

export type GetProductOptionsResponse = {
  count: number;
  options: ProductOption[];
};
