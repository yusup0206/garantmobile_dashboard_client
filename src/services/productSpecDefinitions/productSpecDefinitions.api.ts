import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductSpecDefinition,
  ProductSpecDefinitionInput,
  GetProductSpecDefinitionsParams,
  GetProductSpecDefinitionsResponse,
} from "./productSpecDefinitions.types";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductSpecDefinition[] = [
  { id: "1", nameRu: "Цвет", nameTk: "Reňk" },
  { id: "2", nameRu: "Память", nameTk: "Ýat" },
  { id: "3", nameRu: "Размер экрана", nameTk: "Ekran ölçegi" },
];

export async function getProductSpecDefinitions(
  params?: GetProductSpecDefinitionsParams,
): Promise<GetProductSpecDefinitionsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.innerCategoryId) query.set("innerCategoryId", params.innerCategoryId);
    const queryString = query.toString();
    const endpoint = `/product-spec-definitions/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductSpecDefinitionsResponse> | GetProductSpecDefinitionsResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetProductSpecDefinitionsResponse;
  }

  let filtered = [...mockStore];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.nameRu.toLowerCase().includes(s) || item.nameTk.toLowerCase().includes(s),
    );
  }
  return mockDelay({
    count: filtered.length,
    definitions: filtered,
  });
}

export async function getProductSpecDefinitionById(
  id: string,
): Promise<ProductSpecDefinition> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecDefinition> | ProductSpecDefinition
    >(`/product-spec-definitions/details/${id}`, {
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecDefinition;
  }

  const found = mockStore.find((item) => item.id === id);
  if (!found) throw new Error("Product spec definition not found");
  return mockDelay({ ...found });
}

export async function createProductSpecDefinition(
  input: ProductSpecDefinitionInput,
): Promise<ProductSpecDefinition> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecDefinition> | ProductSpecDefinition
    >("/product-spec-definitions/create", {
      method: "POST",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecDefinition;
  }

  const newItem: ProductSpecDefinition = {
    id: String(Date.now()),
    ...input,
  };
  mockStore.unshift(newItem);
  return mockDelay(newItem);
}

export async function updateProductSpecDefinition(
  id: string,
  input: ProductSpecDefinitionInput,
): Promise<ProductSpecDefinition> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<ProductSpecDefinition> | ProductSpecDefinition
    >(`/product-spec-definitions/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      token: authToken(),
    });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductSpecDefinition;
  }

  const index = mockStore.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Product spec definition not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductSpecDefinition(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<{ deleted: boolean }> | { deleted: boolean }>(
      `/product-spec-definitions/delete/${id}`,
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

  mockStore = mockStore.filter((item) => item.id !== id);
  return mockDelay({ deleted: true });
}
