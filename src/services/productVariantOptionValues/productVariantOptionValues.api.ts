import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  VariantOptionValue,
  VariantOptionValueInput,
  GetVariantOptionValuesParams,
  GetVariantOptionValuesResponse,
} from "./productVariantOptionValues.types";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp?: string;
};

let mockStore: VariantOptionValue[] = [
  { variantId: "var_1", optionValueId: "optval_1" },
  { variantId: "var_1", optionValueId: "optval_3" },
];

export async function getVariantOptionValues(
  params?: GetVariantOptionValuesParams,
): Promise<GetVariantOptionValuesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.variantId) query.set("variantId", params.variantId);
    if (params?.optionValueId) query.set("optionValueId", params.optionValueId);
    const qs = query.toString();
    const endpoint = `/product-variant-option-values/all${qs ? `?${qs}` : ""}`;
    const res = await apiClient<
      ApiResponse<GetVariantOptionValuesResponse> | GetVariantOptionValuesResponse
    >(endpoint, { token: authToken() });
    if ("data" in res && res.data) return res.data;
    return res as GetVariantOptionValuesResponse;
  }

  let filtered = [...mockStore];
  if (params?.variantId) filtered = filtered.filter((l) => l.variantId === params.variantId);
  if (params?.optionValueId) filtered = filtered.filter((l) => l.optionValueId === params.optionValueId);
  return mockDelay({ count: filtered.length, links: filtered });
}

export async function getVariantOptionValueById(
  variantId: string,
  optionValueId: string,
): Promise<VariantOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<VariantOptionValue> | VariantOptionValue>(
      `/product-variant-option-values/details/${variantId}/${optionValueId}`,
      { token: authToken() },
    );
    if ("data" in res && res.data) return res.data;
    return res as VariantOptionValue;
  }

  const found = mockStore.find(
    (l) => l.variantId === variantId && l.optionValueId === optionValueId,
  );
  if (!found) throw new Error("Variant option value not found");
  return mockDelay({ ...found });
}

export async function createVariantOptionValue(
  input: VariantOptionValueInput,
): Promise<VariantOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<VariantOptionValue> | VariantOptionValue>(
      "/product-variant-option-values/create",
      {
        method: "POST",
        body: JSON.stringify(input),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) return res.data;
    return res as VariantOptionValue;
  }

  // Avoid duplicates in mock
  const exists = mockStore.some(
    (l) => l.variantId === input.variantId && l.optionValueId === input.optionValueId,
  );
  if (!exists) mockStore.push({ ...input });
  return mockDelay({ ...input });
}

export async function updateVariantOptionValue(
  variantId: string,
  oldOptionValueId: string,
  newOptionValueId: string,
): Promise<VariantOptionValue> {
  if (isApiEnabled()) {
    const res = await apiClient<ApiResponse<VariantOptionValue> | VariantOptionValue>(
      `/product-variant-option-values/edit/${variantId}/${oldOptionValueId}`,
      {
        method: "PUT",
        body: JSON.stringify({ optionValueId: newOptionValueId }),
        token: authToken(),
      },
    );
    if ("data" in res && res.data) return res.data;
    return res as VariantOptionValue;
  }

  const index = mockStore.findIndex(
    (l) => l.variantId === variantId && l.optionValueId === oldOptionValueId,
  );
  if (index !== -1) mockStore[index] = { variantId, optionValueId: newOptionValueId };
  return mockDelay({ variantId, optionValueId: newOptionValueId });
}

export async function deleteVariantOptionValue(
  variantId: string,
  optionValueId: string,
): Promise<{ deleted: boolean }> {
  if (isApiEnabled()) {
    const res = await apiClient<
      ApiResponse<{ deleted: boolean }> | { deleted: boolean }
    >(`/product-variant-option-values/delete/${variantId}/${optionValueId}`, {
      method: "DELETE",
      token: authToken(),
    });
    if ("data" in res && res.data) return res.data;
    return res as { deleted: boolean };
  }

  mockStore = mockStore.filter(
    (l) => !(l.variantId === variantId && l.optionValueId === optionValueId),
  );
  return mockDelay({ deleted: true });
}
