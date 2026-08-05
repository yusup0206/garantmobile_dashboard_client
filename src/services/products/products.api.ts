import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { PRODUCTS } from "@/data/products.mock";
import type {
  Product,
  ProductDetail,
  ProductInput,
  ProductVariant,
} from "./products.types";

/**
 * Product store. With a real backend (VITE_API_BASE_URL set) it uses the staff
 * /products CRUD; otherwise the in-memory mock below powers the demo. The
 * backend ProductView matches this Product shape 1:1 (brand and category are
 * display names), so no field mapping is needed.
 */

let store: Product[] = PRODUCTS.map((p) => ({ ...p }));
let nextId = Math.max(0, ...store.map((p) => p.id)) + 1;

// Variants and photos live in side stores keyed by product id (the mock Product
// row is flat). They persist for the browser session so the editor round-trips.
const variantStore = new Map<number, ProductVariant[]>();
const photoStore = new Map<number, string[]>();

function cloneVariants(variants: ProductVariant[]): ProductVariant[] {
  return variants.map((v) => ({ ...v, options: v.options.map((o) => ({ ...o })) }));
}

export function getProducts(): Promise<Product[]> {
  if (isApiEnabled()) {
    return apiClient<Product[]>("/products", { token: authToken() });
  }
  return mockDelay(store.map((p) => ({ ...p })));
}

export function getProduct(id: number): Promise<ProductDetail> {
  if (isApiEnabled()) {
    return apiClient<ProductDetail>(`/products/${id}`, { token: authToken() });
  }
  const product = store.find((p) => p.id === id);
  if (!product) throw new Error("error.notFound");
  return mockDelay({
    ...product,
    photos: [...(photoStore.get(id) ?? [])],
    variants: cloneVariants(variantStore.get(id) ?? []),
  });
}

export function createProduct(input: ProductInput): Promise<Product> {
  if (isApiEnabled()) {
    return apiClient<Product>("/products", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const { variants, photos, ...row } = input;
  const product: Product = { ...row, id: nextId++ };
  store = [product, ...store];
  if (variants) variantStore.set(product.id, cloneVariants(variants));
  if (photos) photoStore.set(product.id, [...photos]);
  return mockDelay({ ...product });
}

export function updateProduct(id: number, input: ProductInput): Promise<Product> {
  if (isApiEnabled()) {
    return apiClient<Product>(`/products/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const { variants, photos, ...row } = input;
  store = store.map((p) => (p.id === id ? { ...row, id } : p));
  const updated = store.find((p) => p.id === id);
  if (!updated) throw new Error("error.notFound");
  if (variants) variantStore.set(id, cloneVariants(variants));
  if (photos) photoStore.set(id, [...photos]);
  return mockDelay({ ...updated });
}

export function deleteProduct(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/products/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((p) => p.id !== id);
  variantStore.delete(id);
  photoStore.delete(id);
  return mockDelay(undefined);
}
