export type ProductVariant = {
  id: string;
  productId: string;
  barcode: string;
  price: number | string;
  oldPrice: number | string;
  stock: number;
  isActive: boolean;
  photos: string[];
};

export type ProductVariantInput = {
  productId: string;
  barcode: string;
  price: number;
  oldPrice: number;
  stock: number;
  isActive: boolean;
  photos: string[];
};

export type GetProductVariantsParams = {
  page?: number;
  pageSize?: number;
  productId?: string;
  isActive?: boolean;
};

export type GetProductVariantsResponse = {
  count: number;
  variants: ProductVariant[];
};
