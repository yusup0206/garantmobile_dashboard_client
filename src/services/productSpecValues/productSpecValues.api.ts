import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductSpecValue,
  ProductSpecValueInput,
  GetProductSpecValuesParams,
  GetProductSpecValuesResponse,
} from "./productSpecValues.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductSpecValue[] = [
  { id: "v1", specId: "1", valueRu: "Красный", valueTm: "Gyzyl", sortOrder: 0 },
  { id: "v2", specId: "1", valueRu: "Синий", valueTm: "Gök", sortOrder: 1 },
  { id: "v3", specId: "1", valueRu: "Чёрный", valueTm: "Gara", sortOrder: 2 },
  { id: "v4", specId: "2", valueRu: "64 ГБ", valueTm: "64 GB", sortOrder: 0 },
  { id: "v5", specId: "2", valueRu: "128 ГБ", valueTm: "128 GB", sortOrder: 1 },
  { id: "v6", specId: "2", valueRu: "256 ГБ", valueTm: "256 GB", sortOrder: 2 },
];

export async function getProductSpecValues(
  params?: GetProductSpecValuesParams,
): Promise<GetProductSpecValuesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.specId) query.set("specId", params.specId);
    if (params?.search) query.set("search", params.search);
    const queryString = query.toString();
    const endpoint = `/product-spec-values/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductSpecValuesResponse> | GetProductSpecValuesResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetProductSpecValuesResponse;
  }

  let filtered = [...mockStore];
  if (params?.specId) {
    filtered = filtered.filter((v) => v.specId === params.specId);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.valueRu.toLowerCase().includes(s) ||
        v.valueTm.toLowerCase().includes(s),
    );
  }
  return mockDelay({ count: filtered.length, values: filtered });
}

export async function getProductSpecValueById(
  id: string,
): Promise<ProductSpecValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecValue> | ProductSpecValue
    >(`/product-spec-values/details/${id}`, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecValue;
  }

  const found = mockStore.find((v) => v.id === id);
  if (!found) throw new Error("Product spec value not found");
  return mockDelay({ ...found });
}

export async function createProductSpecValue(
  input: ProductSpecValueInput,
): Promise<ProductSpecValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecValue> | ProductSpecValue
    >("/product-spec-values/create", {
      method: "POST",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecValue;
  }

  const newItem: ProductSpecValue = {
    id: String(Date.now()),
    ...input,
  };
  mockStore.push(newItem);
  return mockDelay(newItem);
}

export async function updateProductSpecValue(
  id: string,
  input: ProductSpecValueInput,
): Promise<ProductSpecValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecValue> | ProductSpecValue
    >(`/product-spec-values/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecValue;
  }

  const index = mockStore.findIndex((v) => v.id === id);
  if (index === -1) throw new Error("Product spec value not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductSpecValue(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-spec-values/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as { deleted: boolean };
  }

  mockStore = mockStore.filter((v) => v.id !== id);
  return mockDelay({ deleted: true });
}
