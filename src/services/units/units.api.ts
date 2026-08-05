import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { UNITS } from "@/data/units.mock";
import type { Unit, UnitInput } from "./units.types";

/**
 * Units API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Unit[] = UNITS.map((u) => ({ ...u }));
let nextId = Math.max(0, ...store.map((u) => u.id)) + 1;

export function getUnits(): Promise<Unit[]> {
  if (isApiEnabled()) {
    return apiClient<Unit[]>("/units", { token: authToken() });
  }
  return mockDelay(store.map((u) => ({ ...u })));
}

export function createUnit(input: UnitInput): Promise<Unit> {
  if (isApiEnabled()) {
    return apiClient<Unit>("/units", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const unit: Unit = { ...input, id: nextId++ };
  store = [unit, ...store];
  return mockDelay({ ...unit });
}

export function updateUnit(id: number, input: UnitInput): Promise<Unit> {
  if (isApiEnabled()) {
    return apiClient<Unit>(`/units/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((u) => (u.id === id ? { ...input, id } : u));
  const updated = store.find((u) => u.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deleteUnit(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/units/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((u) => u.id !== id);
  return mockDelay(undefined);
}

