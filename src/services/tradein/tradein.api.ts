import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { TRADEIN_REQUESTS } from "@/data/tradein.mock";
import type {
  TradeinItem,
  TradeinStatusKey,
  GetTradeinParams,
  GetTradeinResponse,
  UpdateTradeinStatusResponse,
  DeleteTradeinResponse,
} from "./tradein.types";

/**
 * Trade-in API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: TradeinItem[] = TRADEIN_REQUESTS.map((r) => ({ ...r }));

function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getAdminTradein(
  params?: GetTradeinParams,
): Promise<GetTradeinResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.customerId) query.set("customerId", params.customerId);
    if (params?.condition && params.condition !== "all")
      query.set("condition", params.condition);
    if (params?.status && params.status !== "all") query.set("status", params.status);

    const qs = query.toString();
    const endpoint = `/tradein/admin${qs ? `?${qs}` : ""}`;

    const res = await apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: params?.lang ? { "Accept-Language": params.lang } : undefined,
    });

    const data = unwrap<Record<string, unknown>>(res);
    if (data?.tradeIn && Array.isArray(data.tradeIn)) {
      return {
        count: (data.count as number) ?? (data.tradeIn as TradeinItem[]).length,
        tradeIn: data.tradeIn as TradeinItem[],
      };
    }
    if (Array.isArray(res)) {
      return { count: (res as TradeinItem[]).length, tradeIn: res as TradeinItem[] };
    }
    return { count: 0, tradeIn: [] };
  }

  let filtered = [...store];
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter(
      (r) => r.status === params.status || r.st === params.status,
    );
  }
  if (params?.condition && params.condition !== "all") {
    filtered = filtered.filter((r) => r.condition === params.condition);
  }
  if (params?.customerId) {
    filtered = filtered.filter((r) => r.customerId === params.customerId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.brand?.toLowerCase().includes(q) ||
        r.model?.toLowerCase().includes(q) ||
        r.device?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q) ||
        r.customer?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    );
  }

  const count = filtered.length;
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return mockDelay({ count, tradeIn: paginated });
}

/** Alias for backward compatibility */
export const getTradeinRequests = getAdminTradein;

export async function updateTradeinStatus(
  id: string,
  status: TradeinStatusKey,
  lang?: string,
): Promise<UpdateTradeinStatusResponse> {
  if (isApiEnabled()) {
    const res = await apiClient<UpdateTradeinStatusResponse>("/tradein/update-status", {
      method: "POST",
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
      body: JSON.stringify({ id, status }),
    });
    return res;
  }

  store = store.map((r) => (r.id === id ? { ...r, status, st: status } : r));
  return mockDelay({ completed: true });
}

export async function deleteTradein(
  id: string,
  lang?: string,
): Promise<DeleteTradeinResponse> {
  if (isApiEnabled()) {
    const res = await apiClient<DeleteTradeinResponse>(`/tradein/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
    });
    return res;
  }

  store = store.filter((r) => r.id !== id);
  return mockDelay({ deleted: true });
}
