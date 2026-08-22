import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductOptionValue,
  ProductOptionValueInput,
  GetProductOptionValuesParams,
  GetProductOptionValuesResponse,
} from "./productOptionValues.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductOptionValue[] = [
  {
    id: "optval_1",
    optionId: "opt_1",
    valueRu: "Красный",
    valueTk: "Gyzyl",
    hex: "#ef4444",
    sortOrder: 1,
  },
  {
    id: "optval_2",
    optionId: "opt_1",
    valueRu: "Синий",
    valueTk: "Gök",
    hex: "#3b82f6",
    sortOrder: 2,
  },
  {
    id: "optval_3",
    optionId: "opt_2",
    valueRu: "S",
    valueTk: "S",
    hex: "",
    sortOrder: 1,
  },
  {
    id: "optval_4",
    optionId: "opt_2",
    valueRu: "M",
    valueTk: "M",
    hex: "",
    sortOrder: 2,
  },
];

export async function getProductOptionValues(
  params?: GetProductOptionValuesParams,
): Promise<GetProductOptionValuesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.optionId) query.set("optionId", params.optionId);
    const queryString = query.toString();
    const endpoint = `/product-option-values/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductOptionValuesResponse> | GetProductOptionValuesResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) return res.data;
    return res as GetProductOptionValuesResponse;
  }

  let filtered = [...mockStore];
  if (params?.optionId) {
    filtered = filtered.filter((v) => v.optionId === params.optionId);
  }
  return mockDelay({ count: filtered.length, values: filtered });
}

export async function getProductOptionValueById(
  id: string,
): Promise<ProductOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductOptionValue> | ProductOptionValue
    >(`/product-option-values/details/${id}`, { token: authToken() });
    if ("data" in res && res.data) return res.data;
    return res as ProductOptionValue;
  }

  const found = mockStore.find((v) => v.id === id);
  if (!found) throw new Error("Product option value not found");
  return mockDelay({ ...found });
}

export async function createProductOptionValue(
  input: ProductOptionValueInput,
): Promise<ProductOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductOptionValue> | ProductOptionValue
    >("/product-option-values/create", {
      method: "POST",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) return res.data;
    return res as ProductOptionValue;
  }

  const newItem: ProductOptionValue = {
    id: "optval_" + String(Date.now()),
    ...input,
  };
  mockStore.push(newItem);
  return mockDelay(newItem);
}

export async function updateProductOptionValue(
  id: string,
  input: ProductOptionValueInput,
): Promise<ProductOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductOptionValue> | ProductOptionValue
    >(`/product-option-values/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) return res.data;
    return res as ProductOptionValue;
  }

  const index = mockStore.findIndex((v) => v.id === id);
  if (index === -1) throw new Error("Product option value not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductOptionValue(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-option-values/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
    if ("data" in res && res.data) return res.data;
    return res as { deleted: boolean };
  }

  mockStore = mockStore.filter((v) => v.id !== id);
  return mockDelay({ deleted: true });
}
