import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { ORDERS } from "@/data/mock";
import type { Order, OrderStatusKey } from "./orders.types";

/**
 * Orders API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Order[] = ORDERS.map((o) => ({ ...o }));

export function getOrders(): Promise<Order[]> {
  if (isApiEnabled()) {
    return apiClient<Order[]>("/orders", { token: authToken() });
  }
  return mockDelay(store.map((o) => ({ ...o })));
}

export function getRecentOrders(limit = 6): Promise<Order[]> {
  if (isApiEnabled()) {
    return apiClient<Order[]>(`/orders?limit=${limit}`, { token: authToken() });
  }
  return mockDelay(store.slice(0, limit).map((o) => ({ ...o })));
}

export function updateOrderStatus(num: string, st: OrderStatusKey): Promise<Order> {
  if (isApiEnabled()) {
    return apiClient<Order>(`/orders/${num}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((o) => (o.num === num ? { ...o, st } : o));
  const updated = store.find((o) => o.num === num);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

