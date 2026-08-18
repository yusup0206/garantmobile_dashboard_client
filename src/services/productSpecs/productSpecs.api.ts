import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductSpec,
  ProductSpecInput,
  GetProductSpecsParams,
  GetProductSpecsResponse,
} from "./productSpecs.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductSpec[] = [
  { id: "ps_1", productId: "prod_1", specId: "1", specValueId: "v1", sortOrder: 0 },
  { id: "ps_2", productId: "prod_1", specId: "2", specValueId: "v4", sortOrder: 1 },
];

export async function getProductSpecs(
  params?: GetProductSpecsParams,
): Promise<GetProductSpecsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.productId) query.set("productId", params.productId);
    if (params?.specId) query.set("specId", params.specId);
    if (params?.specValueId) query.set("specValueId", params.specValueId);
    const queryString = query.toString();
    const endpoint = `/product-specs/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductSpecsResponse> | GetProductSpecsResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetProductSpecsResponse;
  }

  let filtered = [...mockStore];
  if (params?.productId) {
    filtered = filtered.filter((s) => s.productId === params.productId);
  }
  if (params?.specId) {
    filtered = filtered.filter((s) => s.specId === params.specId);
  }
  if (params?.specValueId) {
    filtered = filtered.filter((s) => s.specValueId === params.specValueId);
  }
  return mockDelay({ count: filtered.length, specs: filtered });
}

export async function getProductSpecById(id: string): Promise<ProductSpec> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductSpec> | ProductSpec>(
      `/product-specs/details/${id}`,
      { token: authToken() },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpec;
  }

  const found = mockStore.find((s) => s.id === id);
  if (!found) throw new Error("Product spec not found");
  return mockDelay({ ...found });
}

export async function createProductSpec(
  input: ProductSpecInput,
): Promise<ProductSpec> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductSpec> | ProductSpec>(
      "/product-specs/create",
      {
        method: "POST",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpec;
  }

  const newItem: ProductSpec = {
    id: "ps_" + String(Date.now()),
    specId: "",
    ...input,
  };
  mockStore.push(newItem);
  return mockDelay(newItem);
}

export async function updateProductSpec(
  id: string,
  input: ProductSpecInput,
): Promise<ProductSpec> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductSpec> | ProductSpec>(
      `/product-specs/edit/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpec;
  }

  const index = mockStore.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Product spec not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductSpec(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-specs/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as { deleted: boolean };
  }

  mockStore = mockStore.filter((s) => s.id !== id);
  return mockDelay({ deleted: true });
}
