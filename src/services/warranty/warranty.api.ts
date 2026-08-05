import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { WARRANTY_CLAIMS } from "@/data/warranty.mock";
import type { WarrantyClaim, WarrantyStatusKey } from "./warranty.types";

/**
 * Warranty API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: WarrantyClaim[] = WARRANTY_CLAIMS.map((c) => ({ ...c }));

export function getWarrantyClaims(): Promise<WarrantyClaim[]> {
  if (isApiEnabled()) {
    return apiClient<WarrantyClaim[]>("/warranty/claims", { token: authToken() });
  }
  return mockDelay(store.map((c) => ({ ...c })));
}

export function updateWarrantyStatus(
  id: string,
  st: WarrantyStatusKey,
): Promise<WarrantyClaim> {
  if (isApiEnabled()) {
    return apiClient<WarrantyClaim>(`/warranty/claims/${id}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((c) => (c.id === id ? { ...c, st } : c));
  const updated = store.find((c) => c.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

