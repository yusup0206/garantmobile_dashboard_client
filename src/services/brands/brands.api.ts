import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { BRANDS } from "@/data/brands.mock";
import type { Brand, BrandInput } from "./brands.types";

/**
 * Brand store. With a real backend (VITE_API_BASE_URL set) it uses the staff
 * /brands CRUD; otherwise the in-memory mock below powers the demo. The backend
 * BrandView matches this Brand shape 1:1 (products is a derived count), so no
 * field mapping is needed.
 */

let store: Brand[] = BRANDS.map((b) => ({ ...b }));
let nextId = Math.max(0, ...store.map((b) => b.id)) + 1;

export function getBrands(): Promise<Brand[]> {
  if (isApiEnabled()) {
    return apiClient<Brand[]>("/brands", { token: authToken() });
  }
  return mockDelay(store.map((b) => ({ ...b })));
}

export function createBrand(input: BrandInput): Promise<Brand> {
  if (isApiEnabled()) {
    return apiClient<Brand>("/brands", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const brand: Brand = { ...input, id: nextId++, products: 0 };
  store = [brand, ...store];
  return mockDelay({ ...brand });
}

export function updateBrand(id: number, input: BrandInput): Promise<Brand> {
  if (isApiEnabled()) {
    return apiClient<Brand>(`/brands/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((b) => (b.id === id ? { ...input, id, products: b.products } : b));
  const updated = store.find((b) => b.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deleteBrand(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/brands/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((b) => b.id !== id);
  return mockDelay(undefined);
}
