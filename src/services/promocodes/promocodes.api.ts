import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { PROMOCODES } from "@/data/promocodes.mock";
import type { Promocode, PromocodeInput } from "./promocodes.types";

/**
 * Promocodes API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Promocode[] = PROMOCODES.map((p) => ({ ...p }));

export function getPromocodes(): Promise<Promocode[]> {
  if (isApiEnabled()) {
    return apiClient<Promocode[]>("/promocodes", { token: authToken() });
  }
  return mockDelay(store.map((p) => ({ ...p })));
}

export function createPromocode(input: PromocodeInput): Promise<Promocode> {
  if (isApiEnabled()) {
    return apiClient<Promocode>("/promocodes", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const promocode: Promocode = { ...input, used: 0 };
  store = [promocode, ...store];
  return mockDelay({ ...promocode });
}

export function updatePromocode(code: string, input: PromocodeInput): Promise<Promocode> {
  if (isApiEnabled()) {
    return apiClient<Promocode>(`/promocodes/${code}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((p) => (p.code === code ? { ...input, used: p.used } : p));
  const updated = store.find((p) => p.code === input.code);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deletePromocode(code: string): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/promocodes/${code}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((p) => p.code !== code);
  return mockDelay(undefined);
}

