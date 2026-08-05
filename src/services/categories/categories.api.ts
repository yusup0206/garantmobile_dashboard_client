import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { CATEGORIES } from "@/data/categories.mock";
import type { Category, CategoryInput } from "./categories.types";

/**
 * Category store. With a real backend (VITE_API_BASE_URL set) it uses the staff
 * /categories CRUD; otherwise the in-memory mock below powers the demo. The
 * backend CategoryView matches this Category shape 1:1, so no field mapping is
 * needed. Real categories back the home builder's category picker.
 */

let store: Category[] = CATEGORIES.map((c) => ({ ...c }));
let nextId = Math.max(0, ...store.map((c) => c.id)) + 1;

export function getCategories(): Promise<Category[]> {
  if (isApiEnabled()) {
    return apiClient<Category[]>("/categories", { token: authToken() });
  }
  return mockDelay(store.map((c) => ({ ...c })));
}

export function createCategory(input: CategoryInput): Promise<Category> {
  if (isApiEnabled()) {
    return apiClient<Category>("/categories", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const category: Category = { ...input, id: nextId++, products: 0 };
  store = [category, ...store];
  return mockDelay({ ...category });
}

export function updateCategory(id: number, input: CategoryInput): Promise<Category> {
  if (isApiEnabled()) {
    return apiClient<Category>(`/categories/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((c) => (c.id === id ? { ...c, ...input, id } : c));
  const updated = store.find((c) => c.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deleteCategory(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/categories/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((c) => c.id !== id);
  return mockDelay(undefined);
}
