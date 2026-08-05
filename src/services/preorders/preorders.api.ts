import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { PREORDERS } from "@/data/preorders.mock";
import type { Preorder, PreorderStatusKey } from "./preorders.types";

/**
 * Preorders API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Preorder[] = PREORDERS.map((p) => ({ ...p }));

export function getPreorders(): Promise<Preorder[]> {
  if (isApiEnabled()) {
    return apiClient<Preorder[]>("/preorders", { token: authToken() });
  }
  return mockDelay(store.map((p) => ({ ...p })));
}

export function updatePreorderStatus(
  num: string,
  st: PreorderStatusKey,
): Promise<Preorder> {
  if (isApiEnabled()) {
    return apiClient<Preorder>(`/preorders/${num}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((p) => (p.num === num ? { ...p, st } : p));
  const updated = store.find((p) => p.num === num);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

