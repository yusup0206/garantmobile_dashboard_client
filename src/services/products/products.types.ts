/** A single product as returned by the API. */
export type Product = {
  id: string;
  nameRu: string;
  nameTm: string;
  shortRu: string;
  shortTm: string;
  photos: string[];
  stock: number;
  price: number;
  oldPrice: number;
  brandId: string;
  categoryId: string;
  unitId: string;
};

/**
 * Payload for create/update — everything except the server-assigned id.
 */
export type ProductInput = Omit<Product, "id">;

/** Response shape for GET /garant/products/all */
export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
  lang?: string;
};

export type GetProductsResponse = {
  count: number;
  products: Product[];
};

export type DeleteProductResponse = {
  deleted: boolean;
};
