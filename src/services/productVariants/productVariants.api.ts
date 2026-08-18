import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  ProductVariant,
  ProductVariantInput,
  GetProductVariantsParams,
  GetProductVariantsResponse,
} from "./productVariants.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: ProductVariant[] = [
  {
    id: "var_1",
    productId: "prod_1",
    barcode: "8680001001",
    price: 15000,
    oldPrice: 16000,
    stock: 8,
    isActive: true,
    photos: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
  },
  {
    id: "var_2",
    productId: "prod_1",
    barcode: "8680001002",
    price: 16500,
    oldPrice: 17500,
    stock: 4,
    isActive: true,
    photos: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400"],
  },
];

export async function getProductVariants(
  params?: GetProductVariantsParams,
): Promise<GetProductVariantsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.productId) query.set("productId", params.productId);
    if (params?.isActive !== undefined) query.set("isActive", String(params.isActive));
    const queryString = query.toString();
    const endpoint = `/product-variants/all${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetProductVariantsResponse> | GetProductVariantsResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as GetProductVariantsResponse;
  }

  let filtered = [...mockStore];
  if (params?.productId) {
    filtered = filtered.filter((v) => v.productId === params.productId);
  }
  if (params?.isActive !== undefined) {
    filtered = filtered.filter((v) => v.isActive === params.isActive);
  }
  return mockDelay({ count: filtered.length, variants: filtered });
}

export async function getProductVariantById(id: string): Promise<ProductVariant> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductVariant> | ProductVariant>(
      `/product-variants/details/${id}`,
      { token: authToken() },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductVariant;
  }

  const found = mockStore.find((v) => v.id === id);
  if (!found) throw new Error("Product variant not found");
  return mockDelay({ ...found });
}

export async function createProductVariant(
  input: ProductVariantInput,
): Promise<ProductVariant> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductVariant> | ProductVariant>(
      "/product-variants/create",
      {
        method: "POST",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductVariant;
  }

  const newItem: ProductVariant = {
    id: "var_" + String(Date.now()),
    ...input,
  };
  mockStore.push(newItem);
  return mockDelay(newItem);
}

export async function updateProductVariant(
  id: string,
  input: ProductVariantInput,
): Promise<ProductVariant> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<ProductVariant> | ProductVariant>(
      `/product-variants/edit/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) {
      return res.data;
    }
    return res as ProductVariant;
  }

  const index = mockStore.findIndex((v) => v.id === id);
  if (index === -1) throw new Error("Product variant not found");
  mockStore[index] = { ...mockStore[index], ...input };
  return mockDelay(mockStore[index]);
}

export async function deleteProductVariant(
  id: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-variants/delete/${id}`, {
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
