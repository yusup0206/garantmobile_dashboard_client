export type ProductStatusKey = "active" | "draft" | "archived";

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  st: ProductStatusKey;
};

export type ProductVariantStatusKey = "active" | "archived";

/** A defining option of a variant, e.g. { name: "Цвет", value: "Титан" }. */
export type ProductVariantOption = { name: string; value: string };

/** A purchasable variant: own SKU, price and stock. */
export type ProductVariant = {
  /** Set for a variant loaded from the backend; sent back so it reconciles by
   *  id (updated in place) instead of being recreated. New variants omit it. */
  id?: number;
  sku: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  status: ProductVariantStatusKey;
  options: ProductVariantOption[];
};

/**
 * Payload for create/update — everything except the server-assigned id.
 * `variants` is optional: omitted leaves the product's variants untouched;
 * present (even empty) replaces the whole set.
 */
export type ProductInput = Omit<Product, "id"> & {
  /** Image URLs (uploaded or pasted); array order is the gallery order. */
  photos?: string[];
  variants?: ProductVariant[];
};

/** Product detail (GET /products/:id) — the row plus photos and variants. */
export type ProductDetail = Product & {
  photos: string[];
  variants: ProductVariant[];
};
