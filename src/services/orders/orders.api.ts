import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { ORDERS } from "@/data/mock";
import type {
  Order,
  OrderStatusKey,
  GetOrdersParams,
  GetOrdersResponse,
} from "./orders.types";

/**
 * Orders API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Order[] = ORDERS.map((o) => ({ ...o }));

function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getOrders(
  params?: GetOrdersParams,
): Promise<GetOrdersResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.status) query.set("status", params.status);
    if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
    if (params?.dateTo) query.set("dateTo", params.dateTo);
    if (params?.customerId) query.set("customerId", params.customerId);
    if (params?.productId) query.set("productId", params.productId);
    if (params?.variantId) query.set("variantId", params.variantId);

    const qs = query.toString();
    const endpoint = `/orders/all${qs ? `?${qs}` : ""}`;

    const res = await apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    });

    const data = unwrap<Record<string, unknown>>(res);
    if (data?.orders && Array.isArray(data.orders)) {
      return {
        count: (data.count as number) ?? (data.orders as Order[]).length,
        orders: data.orders as Order[],
      };
    }
    if (Array.isArray(res)) {
      return { count: (res as Order[]).length, orders: res as Order[] };
    }
    return { count: 0, orders: [] };
  }

  let filtered = [...store];
  if (params?.status) {
    filtered = filtered.filter((o) => o.status === params.status);
  }
  if (params?.customerId) {
    filtered = filtered.filter((o) => o.customerId === params.customerId);
  }
  if (params?.productId) {
    filtered = filtered.filter((o) =>
      o.items?.some((it) => it.productId === params.productId),
    );
  }
  if (params?.variantId) {
    filtered = filtered.filter((o) =>
      o.items?.some((it) => it.variantId === params.variantId),
    );
  }
  if (params?.dateFrom) {
    const fromTime = new Date(params.dateFrom).getTime();
    filtered = filtered.filter((o) => new Date(o.created).getTime() >= fromTime);
  }
  if (params?.dateTo) {
    const toTime = new Date(params.dateTo).getTime();
    filtered = filtered.filter((o) => new Date(o.created).getTime() <= toTime);
  }

  const count = filtered.length;
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return mockDelay({ count, orders: paginated });
}

export async function getOrderDetails(id: string, lang = "tk"): Promise<Order> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/orders/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<Order>(res);
  }

  const found = store.find((o) => o.id === id || o.orderNumber === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatusKey,
  lang = "tk",
): Promise<Order> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/orders/status/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify({ status }),
    });
    return unwrap<Order>(res);
  }

  store = store.map((o) =>
    o.id === id || o.orderNumber === id
      ? {
          ...o,
          status,
          updated: new Date().toISOString(),
          confirmedAt: status === "confirmed" ? new Date().toISOString() : o.confirmedAt,
          cancelledAt: status === "cancelled" ? new Date().toISOString() : o.cancelledAt,
        }
      : o,
  );
  const updated = store.find((o) => o.id === id || o.orderNumber === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function getRecentOrders(limit = 6): Promise<Order[]> {
  const res = await getOrders({ page: 1, pageSize: limit });
  return res.orders;
}
