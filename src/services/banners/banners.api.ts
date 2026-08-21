import { apiClient } from "@/services/api/apiClient";
import { authToken } from "@/services/api/authToken";
import type {
  Banner,
  BannerInput,
  GetBannersParams,
  GetBannersResponse,
} from "./banners.types";

const BASE = "/banners";

export async function getBanners(
  params?: GetBannersParams,
): Promise<GetBannersResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.search) qs.set("search", params.search);
  if (params?.linkType) qs.set("linkType", params.linkType);
  if (params?.placement) qs.set("placement", params.placement);
  const query = qs.toString();
  const url = query ? `${BASE}/all?${query}` : `${BASE}/all`;
  const res = await apiClient<GetBannersResponse>(url, { token: authToken() });
  return res;
}

export async function getBannerById(id: string): Promise<Banner> {
  const res = await apiClient<{ count: number; banners: Banner[] }>(
    `${BASE}/details/${id}`,
    { token: authToken() },
  );
  return res.banners[0];
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  return apiClient<Banner>(`${BASE}/create`, {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(input),
  });
}

export async function updateBanner(
  id: string,
  input: BannerInput,
): Promise<Banner> {
  return apiClient<Banner>(`${BASE}/edit/${id}`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify(input),
  });
}

export async function deleteBanner(id: string): Promise<void> {
  await apiClient<{ deleted: boolean }>(`${BASE}/delete/${id}`, {
    method: "DELETE",
    token: authToken(),
  });
}
