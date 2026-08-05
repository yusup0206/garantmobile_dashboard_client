import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { SHIPMENTS } from "@/data/delivery.mock";
import type { DeliveryStatusKey, Shipment } from "./delivery.types";

/**
 * Delivery API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Shipment[] = SHIPMENTS.map((s) => ({ ...s }));

export function getShipments(): Promise<Shipment[]> {
  if (isApiEnabled()) {
    return apiClient<Shipment[]>("/delivery/shipments", { token: authToken() });
  }
  return mockDelay(store.map((s) => ({ ...s })));
}

export function updateShipmentStatus(
  id: string,
  st: DeliveryStatusKey,
): Promise<Shipment> {
  if (isApiEnabled()) {
    return apiClient<Shipment>(`/delivery/shipments/${id}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((s) => (s.id === id ? { ...s, st } : s));
  const updated = store.find((s) => s.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

