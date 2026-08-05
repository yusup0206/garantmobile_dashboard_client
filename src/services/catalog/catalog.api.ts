import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { CATALOG_ITEMS, CATEGORIES } from "@/data/catalog.mock";
import type { CatalogItem, Category } from "./catalog.types";

export function getCatalog(): Promise<CatalogItem[]> {
  if (isApiEnabled()) {
    return apiClient<CatalogItem[]>("/catalog", { token: authToken() });
  }
  return mockDelay(CATALOG_ITEMS);
}

export function getCategories(): Promise<Category[]> {
  if (isApiEnabled()) {
    return apiClient<Category[]>("/catalog/categories", { token: authToken() });
  }
  return mockDelay(CATEGORIES, 200);
}

