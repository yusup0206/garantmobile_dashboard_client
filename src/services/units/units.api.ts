import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { UNITS } from "@/data/units.mock";
import type {
  Unit,
  UnitInput,
  GetUnitsParams,
  GetUnitsResponse,
  DeleteUnitResponse,
} from "./units.types";

let store: Unit[] = UNITS.map((u) => ({ ...u }));

/** Unwrap potential { statusCode, success, data: ... } response envelope */
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getUnits(params?: GetUnitsParams): Promise<GetUnitsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const endpoint = `/units/all${qs ? `?${qs}` : ""}`;

    const res = await apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    });

    const data = unwrap<Record<string, unknown>>(res);
    if (data?.units && Array.isArray(data.units)) {
      return {
        count: (data.count as number) ?? (data.units as Unit[]).length,
        units: data.units as Unit[],
      };
    }
    if (Array.isArray(res)) {
      return { count: res.length, units: res as Unit[] };
    }
    return { count: 0, units: [] };
  }

  let filtered = [...store];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.nameRu.toLowerCase().includes(q) ||
        u.nameTk.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q),
    );
  }
  return mockDelay({ count: filtered.length, units: filtered });
}

export async function getUnitById(id: string, lang = "tk"): Promise<Unit> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/units/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<Unit>(res);
  }
  const found = store.find((u) => u.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createUnit(input: UnitInput, lang = "tk"): Promise<Unit> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>("/units/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Unit>(res);
  }
  if (input.isDefault) {
    store = store.map((u) => ({ ...u, isDefault: false }));
  }
  const unit: Unit = {
    ...input,
    id: `unit_${Date.now()}`,
  };
  store = [unit, ...store];
  return mockDelay({ ...unit });
}

export async function updateUnit(
  id: string,
  input: UnitInput,
  lang = "tk",
): Promise<Unit> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/units/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    });
    return unwrap<Unit>(res);
  }
  if (input.isDefault) {
    store = store.map((u) => ({ ...u, isDefault: false }));
  }
  store = store.map((u) => (u.id === id ? { ...u, ...input } : u));
  const updated = store.find((u) => u.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteUnit(id: string, lang = "tk"): Promise<DeleteUnitResponse> {
  if (isApiEnabled()) {
    const res = await apiClient<unknown>(`/units/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
    return unwrap<DeleteUnitResponse>(res);
  }
  store = store.filter((u) => u.id !== id);
  return mockDelay({ deleted: true });
}
