import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { TRADEIN_REQUESTS } from "@/data/tradein.mock";
import type { TradeinRequest, TradeinStatusKey } from "./tradein.types";

/**
 * Trade-in API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: TradeinRequest[] = TRADEIN_REQUESTS.map((r) => ({ ...r }));

export function getTradeinRequests(): Promise<TradeinRequest[]> {
  if (isApiEnabled()) {
    return apiClient<TradeinRequest[]>("/tradein/requests", { token: authToken() });
  }
  return mockDelay(store.map((r) => ({ ...r })));
}

export function updateTradeinStatus(
  id: string,
  st: TradeinStatusKey,
): Promise<TradeinRequest> {
  if (isApiEnabled()) {
    return apiClient<TradeinRequest>(`/tradein/requests/${id}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((r) => (r.id === id ? { ...r, st } : r));
  const updated = store.find((r) => r.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

