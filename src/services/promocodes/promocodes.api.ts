import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  Promocode,
  PromocodeInput,
  GetPromocodesParams,
  GetPromocodesResponse,
  DeletePromocodeResponse,
} from "./promocodes.types";

/**
 * Promocodes API service.
 * Real endpoints: /promocodes/*
 * Falls back to in-memory mock when VITE_API_BASE_URL is not configured.
 */

// ---------------------------------------------------------------------------
// In-memory mock store (demo / dev without a backend)
// ---------------------------------------------------------------------------
let store: Promocode[] = [
  {
    id: "clg1x0z5e0000v6l3f4b7j2k1",
    code: "SUMMER20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    descriptionTk: "Tomusky arzanladyş",
    descriptionRu: "Летняя скидка",
    minOrderAmount: 100,
    startsAt: "2026-06-01T00:00:00.000Z",
    expiresAt: "2026-09-01T00:00:00.000Z",
    usageLimit: 500,
    usedCount: 142,
    isForNewClients: false,
    isActive: true,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k2",
    code: "NEWUSER50",
    discountType: "FIXED_AMOUNT",
    discountValue: 50,
    descriptionTk: "Täze ulanyjy üçin",
    descriptionRu: "Для новых клиентов",
    minOrderAmount: 200,
    startsAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2026-12-31T00:00:00.000Z",
    usageLimit: 1000,
    usedCount: 308,
    isForNewClients: true,
    isActive: true,
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k3",
    code: "EXPIRED10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    descriptionTk: "Geçen arzanladyş",
    descriptionRu: "Истёкшая акция",
    minOrderAmount: 0,
    startsAt: "2025-01-01T00:00:00.000Z",
    expiresAt: "2025-06-01T00:00:00.000Z",
    usageLimit: 200,
    usedCount: 189,
    isForNewClients: false,
    isActive: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildQuery(params: GetPromocodesParams): string {
  const q = new URLSearchParams();
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.pageSize !== undefined) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.discountType) q.set("discountType", params.discountType);
  if (params.minOrderAmount !== undefined)
    q.set("minOrderAmount", String(params.minOrderAmount));
  if (params.usageLimit !== undefined) q.set("usageLimit", String(params.usageLimit));
  if (params.usedCount !== undefined) q.set("usedCount", String(params.usedCount));
  if (params.isForNewClients !== undefined)
    q.set("isForNewClients", String(params.isForNewClients));
  if (params.isActive !== undefined) q.set("isActive", String(params.isActive));
  if (params.startsAt) q.set("startsAt", params.startsAt);
  if (params.expiresAt) q.set("expiresAt", params.expiresAt);
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------
// Unwrap { statusCode, success, data, timestamp } envelope if present
// ---------------------------------------------------------------------------
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getPromocodes(
  params: GetPromocodesParams = {},
): Promise<GetPromocodesResponse> {
  if (isApiEnabled()) {
    const qs = buildQuery(params);
    const res = await apiClient<unknown>(`/promocodes/all${qs}`, {
      token: authToken(),
      headers: { "Accept-Language": params.lang ?? "tk" },
    });
    return unwrap<GetPromocodesResponse>(res);
  }

  // Mock: simple local filtering
  let filtered = [...store];
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.code.toLowerCase().includes(q));
  }
  if (params.isActive !== undefined) {
    filtered = filtered.filter((p) => p.isActive === params.isActive);
  }
  if (params.isForNewClients !== undefined) {
    filtered = filtered.filter((p) => p.isForNewClients === params.isForNewClients);
  }
  if (params.discountType) {
    filtered = filtered.filter((p) => p.discountType === params.discountType);
  }
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  return mockDelay({ count: filtered.length, promocodes: paged });
}

export async function getPromocode(id: string, lang = "tk"): Promise<Promocode> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/promocodes/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<Promocode>(res);
  }
  const found = store.find((p) => p.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createPromocode(
  input: PromocodeInput,
  lang = "tk",
): Promise<Promocode> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>("/promocodes/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Promocode>(res);
  }
  const promocode: Promocode = {
    ...input,
    id: `mock_${Date.now()}`,
    usedCount: 0,
  };
  store = [promocode, ...store];
  return mockDelay({ ...promocode });
}

export async function updatePromocode(
  id: string,
  input: PromocodeInput,
  lang = "tk",
): Promise<Promocode> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/promocodes/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Promocode>(res);
  }
  store = store.map((p) => (p.id === id ? { ...p, ...input } : p));
  const updated = store.find((p) => p.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deletePromocode(
  id: string,
  lang = "tk",
): Promise<DeletePromocodeResponse> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/promocodes/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<DeletePromocodeResponse>(res);
  }
  store = store.filter((p) => p.id !== id);
  return mockDelay({ deleted: true });
}
