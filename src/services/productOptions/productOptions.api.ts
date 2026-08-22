import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductOption,
  ProductOptionInput,
  GetProductOptionsParams,
  GetProductOptionsResponse,
} from "./productOptions.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductOption[] = [
  {
    id: "opt_1",
    productId: "prod_1",
    nameRu: "Цвет",
    nameTk: "Reňk",
    sortOrder: 1,
  },
  {
    id: "opt_2",
    productId: "prod_1",
    nameRu: "Размер",
    nameTk: "Ölçeg",
    sortOrder: 2,
  },
];

export async function getProductOptions(
  params?: GetProductOptionsParams,
): Promise<GetProductOptionsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.productId) query.set("productId", params.productId);
    const queryString = query.toString();
    const endpoint = `/product-options/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductOptionsResponse> | GetProductOptionsResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetProductOptionsResponse;
  }

  let filtered = [...mockStore];
  if (params?.productId) {
    filtered = filtered.filter((o) => o.productId === params.productId);
  }
  return mockDelay({ count: filtered.length, options: filtered });
}

export async function getProductOptionById(id: string): Promise<ProductOption> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductOption> | ProductOption>(
      `/product-options/details/${id}`,
      { token: authToken() },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductOption;
  }

  const found = mockStore.find((o) => o.id === id);
  if (!found) throw new Error("Product option not found");
  return mockDelay({ ...found });
}

export async function createProductOption(
  input: ProductOptionInput,
): Promise<ProductOption> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductOption> | ProductOption>(
      "/product-options/create",
      {
        method: "POST",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductOption;
  }

  const newItem: ProductOption = {
    id: "opt_" + String(Date.now()),
    ...input,
  };
  mockStore.push(newItem);
  return mockDelay(newItem);
}

export async function updateProductOption(
  id: string,
  input: ProductOptionInput,
): Promise<ProductOption> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductOption> | ProductOption>(
      `/product-options/edit/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductOption;
  }

  const index = mockStore.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Product option not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductOption(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-options/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as { deleted: boolean };
  }

  mockStore = mockStore.filter((o) => o.id !== id);
  return mockDelay({ deleted: true });
}
