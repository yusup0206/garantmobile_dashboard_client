import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { DRIVERS } from "@/data/drivers.mock";
import type { Driver, DriverInput } from "./drivers.types";

/**
 * Drivers API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Driver[] = DRIVERS.map((d) => ({ ...d }));
let nextId = Math.max(0, ...store.map((d) => d.id)) + 1;

export function getDrivers(): Promise<Driver[]> {
  if (isApiEnabled()) {
    return apiClient<Driver[]>("/drivers", { token: authToken() });
  }
  return mockDelay(store.map((d) => ({ ...d })));
}

export function createDriver(input: DriverInput): Promise<Driver> {
  if (isApiEnabled()) {
    return apiClient<Driver>("/drivers", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const driver: Driver = { ...input, id: nextId++, deliveries: 0 };
  store = [driver, ...store];
  return mockDelay({ ...driver });
}

export function updateDriver(id: number, input: DriverInput): Promise<Driver> {
  if (isApiEnabled()) {
    return apiClient<Driver>(`/drivers/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((d) =>
    d.id === id ? { ...input, id, deliveries: d.deliveries } : d,
  );
  const updated = store.find((d) => d.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deleteDriver(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/drivers/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((d) => d.id !== id);
  return mockDelay(undefined);
}

