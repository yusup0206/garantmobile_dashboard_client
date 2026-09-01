import { apiClient } from "@/services/api/apiClient";
import { authToken } from "@/services/api/authToken";
import type {
  CreateHomeBlockInput,
  GetHomeBlocksParams,
  GetHomeBlocksResponse,
  HomeBlock,
  UpdateHomeBlockInput,
} from "./home.types";

const BASE = "/home";

/** Unwrap standard { statusCode, success, data: ... } backend response envelope */
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getHomeBlocks(
  params?: GetHomeBlocksParams,
): Promise<GetHomeBlocksResponse> {
  const qs = new URLSearchParams();
  if (params?.kind) qs.set("kind", params.kind);
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  const url = query ? `${BASE}/all?${query}` : `${BASE}/all`;
  const res = await apiClient<unknown>(url, { token: authToken() });
  const data = unwrap<GetHomeBlocksResponse>(res);
  return {
    count: data?.count ?? (data?.blocks ? data.blocks.length : 0),
    blocks: data?.blocks ?? [],
  };
}

export async function getHomeBlockById(id: string): Promise<HomeBlock> {
  const res = await apiClient<unknown>(`${BASE}/details/${id}`, {
    token: authToken(),
  });
  return unwrap<HomeBlock>(res);
}

export async function createHomeBlock(
  input: CreateHomeBlockInput,
): Promise<HomeBlock> {
  const res = await apiClient<unknown>(`${BASE}/create`, {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return unwrap<HomeBlock>(res);
}

export async function updateHomeBlock(
  id: string,
  input: UpdateHomeBlockInput,
): Promise<HomeBlock> {
  const res = await apiClient<unknown>(`${BASE}/edit/${id}`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return unwrap<HomeBlock>(res);
}

export async function reorderHomeBlocks(
  blockIds: string[],
): Promise<GetHomeBlocksResponse> {
  const res = await apiClient<unknown>(`${BASE}/reorder`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify({ blockIds }),
  });
  const data = unwrap<GetHomeBlocksResponse>(res);
  return {
    count: data?.count ?? (data?.blocks ? data.blocks.length : 0),
    blocks: data?.blocks ?? [],
  };
}

export async function deleteHomeBlock(
  id: string,
): Promise<{ deleted: boolean }> {
  const res = await apiClient<unknown>(`${BASE}/delete/${id}`, {
    method: "DELETE",
    token: authToken(),
  });
  return unwrap<{ deleted: boolean }>(res);
}
