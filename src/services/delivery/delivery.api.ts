import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  DeliveryType,
  DeliveryTypeInput,
  GetDeliveryTypesParams,
  GetDeliveryTypesResponse,
  DeleteDeliveryTypeResponse,
} from "./delivery.types";

let store: DeliveryType[] = [];

function formatPayload(input: DeliveryTypeInput) {
  return {
    ...input,
    price: String(input.price ?? 0),
    discountForMethod: Number(input.discountForMethod ?? 0),
    sortOrder: Number(input.sortOrder ?? 0),
    isSelfPickup: Boolean(input.isSelfPickup),
    isActive: Boolean(input.isActive),
  };
}

export async function getDeliveryTypes(
  params?: GetDeliveryTypesParams,
): Promise<GetDeliveryTypesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.isActive !== undefined && params.isActive !== "") {
      query.set("isActive", String(params.isActive));
    }
    if (params?.isSelfPickup !== undefined && params.isSelfPickup !== "") {
      query.set("isSelfPickup", String(params.isSelfPickup));
    }

    const queryString = query.toString();
    const endpoint = `/delivery/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.deliveryTypes && Array.isArray(dataObj.deliveryTypes)) {
        return {
          count:
            (dataObj.count as number) ?? (dataObj.deliveryTypes as DeliveryType[]).length,
          deliveryTypes: dataObj.deliveryTypes as DeliveryType[],
        };
      }
      if (r?.deliveryTypes && Array.isArray(r.deliveryTypes)) {
        return {
          count: (r.count as number) ?? (r.deliveryTypes as DeliveryType[]).length,
          deliveryTypes: r.deliveryTypes as DeliveryType[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, deliveryTypes: r as DeliveryType[] };
      }
      if (Array.isArray(r?.data)) {
        return {
          count: (r.data as DeliveryType[]).length,
          deliveryTypes: r.data as DeliveryType[],
        };
      }
      return { count: 0, deliveryTypes: [] };
    });
  }

  let filtered = [...store];
  if (params?.isActive !== undefined && params.isActive !== "") {
    const act = String(params.isActive) === "true";
    filtered = filtered.filter((d) => String(d.isActive) === String(act));
  }
  if (params?.isSelfPickup !== undefined && params.isSelfPickup !== "") {
    const self = String(params.isSelfPickup) === "true";
    filtered = filtered.filter((d) => String(d.isSelfPickup) === String(self));
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.titleRu?.toLowerCase().includes(q) ||
        d.titleTk?.toLowerCase().includes(q) ||
        d.descriptionRu?.toLowerCase().includes(q) ||
        d.descriptionTk?.toLowerCase().includes(q),
    );
  }

  return mockDelay({
    count: filtered.length,
    deliveryTypes: filtered,
  });
}

export async function getDeliveryTypeById(
  id: string,
  lang?: string,
): Promise<DeliveryType> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/delivery/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as DeliveryType;
    });
  }
  const found = store.find((d) => d.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createDeliveryType(
  input: DeliveryTypeInput,
  lang?: string,
): Promise<DeliveryType> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/delivery/create", {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(formatPayload(input)),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as DeliveryType;
    });
  }
  const dt: DeliveryType = {
    ...input,
    id: `delivery_${Date.now()}`,
  };
  store = [dt, ...store];
  return mockDelay({ ...dt });
}

export async function updateDeliveryType(
  id: string,
  input: DeliveryTypeInput,
  lang?: string,
): Promise<DeliveryType> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/delivery/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(formatPayload(input)),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as DeliveryType;
    });
  }
  store = store.map((d) => (d.id === id ? { ...d, ...input } : d));
  const updated = store.find((d) => d.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteDeliveryType(
  id: string,
  lang?: string,
): Promise<DeleteDeliveryTypeResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteDeliveryTypeResponse>(`/delivery/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    });
  }
  store = store.filter((d) => d.id !== id);
  return mockDelay({ deleted: true });
}

/** Backward compatibility exports */
export const getShipments = getDeliveryTypes;
