import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  Brand,
  BrandInput,
  GetBrandsParams,
  GetBrandsResponse,
} from "./brands.types";

/**
 * Standard backend response envelope structure.
 */
export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

/**
 * Brand store. Interacts with /brands/* endpoints when API is enabled.
 */

let store: Brand[] = [];

export async function getBrands(params?: GetBrandsParams): Promise<GetBrandsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    const queryString = query.toString();
    const endpoint = `/brands/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<ApiResponse<GetBrandsResponse> | GetBrandsResponse>(
      endpoint,
      { token: authToken() },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetBrandsResponse;
  }

  let filtered = [...store];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((b) => b.name.toLowerCase().includes(s));
  }
  return mockDelay({
    count: filtered.length,
    brands: filtered,
  });
}

export async function getBrandById(id: string): Promise<Brand> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<Brand> | Brand>(`/brands/details/${id}`, {
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as Brand;
  }
  const found = store.find((b) => b.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createBrand(input: BrandInput): Promise<Brand> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<Brand> | Brand>("/brands/create", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as Brand;
  }
  const brand: Brand = {
    ...input,
    id: `brand_${Date.now()}`,
    tags: [],
  };
  store = [brand, ...store];
  return mockDelay({ ...brand });
}

export async function updateBrand(id: string, input: BrandInput): Promise<Brand> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<Brand> | Brand>(`/brands/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as Brand;
  }
  store = store.map((b) => (b.id === id ? { ...b, ...input } : b));
  const updated = store.find((b) => b.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteBrand(id: string): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<{ deleted: boolean }> | { deleted: boolean }>(
      `/brands/delete/${id}`,
      {
        method: "DELETE",
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as { deleted: boolean };
  }
  store = store.filter((b) => b.id !== id);
  return mockDelay({ deleted: true });
}
