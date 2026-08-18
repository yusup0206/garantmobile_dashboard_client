import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  Product,
  ProductInput,
  GetProductsParams,
  GetProductsResponse,
  DeleteProductResponse,
} from "./products.types";

/**
 * Product service. Uses /products/* endpoints when API is enabled;
 * falls back to an in-memory mock for demo mode.
 */

let store: Product[] = [
  {
    id: "prod_1",
    nameRu: "iPhone 15 Pro",
    nameTm: "iPhone 15 Pro",
    shortRu: "Смартфон Apple",
    shortTm: "Apple smartfony",
    photos: [],
    stock: 10,
    price: 15000,
    oldPrice: 16000,
    brandId: "brand_1",
    categoryId: "1",
    unitId: "unit_1",
  },
  {
    id: "prod_2",
    nameRu: "Samsung Galaxy S24",
    nameTm: "Samsung Galaxy S24",
    shortRu: "Смартфон Samsung",
    shortTm: "Samsung smartfony",
    photos: [],
    stock: 5,
    price: 12000,
    oldPrice: 0,
    brandId: "brand_2",
    categoryId: "1",
    unitId: "unit_1",
  },
];

/** Unwrap potential { statusCode, success, data: ... } response envelope */
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<GetProductsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.brandId) query.set("brandId", params.brandId);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    const qs = query.toString();
    const endpoint = `/products/all${qs ? `?${qs}` : ""}`;

    const res = await apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    });

    const data = unwrap<Record<string, unknown>>(res);
    if (data?.products && Array.isArray(data.products)) {
      return {
        count: (data.count as number) ?? (data.products as Product[]).length,
        products: data.products as Product[],
      };
    }
    if (Array.isArray(res)) {
      return { count: (res as Product[]).length, products: res as Product[] };
    }
    return { count: 0, products: [] };
  }

  let filtered = [...store];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.nameRu.toLowerCase().includes(q) || p.nameTm.toLowerCase().includes(q),
    );
  }
  if (params?.brandId) {
    filtered = filtered.filter((p) => p.brandId === params.brandId);
  }
  if (params?.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === params.categoryId);
  }
  return mockDelay({ count: filtered.length, products: filtered });
}

export async function getProduct(id: string, lang = "tk"): Promise<Product> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/products/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<Product>(res);
  }
  const found = store.find((p) => p.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createProduct(input: ProductInput, lang = "tk"): Promise<Product> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>("/products/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Product>(res);
  }
  const product: Product = { ...input, id: `prod_${Date.now()}` };
  store = [product, ...store];
  return mockDelay({ ...product });
}

export async function updateProduct(
  id: string,
  input: ProductInput,
  lang = "tk",
): Promise<Product> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/products/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Product>(res);
  }
  store = store.map((p) => (p.id === id ? { ...p, ...input } : p));
  const updated = store.find((p) => p.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteProduct(
  id: string,
  lang = "tk",
): Promise<DeleteProductResponse> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/products/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<DeleteProductResponse>(res);
  }
  store = store.filter((p) => p.id !== id);
  return mockDelay({ deleted: true });
}
