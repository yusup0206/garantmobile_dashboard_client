import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  PreorderTag,
  PreorderTagInput,
  GetPreorderTagsParams,
  GetPreorderTagsResponse,
  DeletePreorderTagResponse,
  PreorderItem,
  PreorderInput,
  GetPreordersParams,
  GetPreordersResponse,
  DeletePreorderResponse,
  PreorderRequestItem,
  GetPreorderRequestsParams,
  GetPreorderRequestsResponse,
} from "./preorders.types";

/** Mock Stores for local/dev fallback */
let mockTags: PreorderTag[] = [
  { id: "tag_pre_1", nameTk: "Eksklýuziw", nameRu: "Эксклюзив" },
  { id: "tag_pre_2", nameTk: "Täze Flagman", nameRu: "Новый флагман" },
  { id: "tag_pre_3", nameTk: "Çäkli tapgyr", nameRu: "Ограниченная серия" },
];

let mockPreorders: PreorderItem[] = [
  {
    id: "pre_1",
    titleTk: "iPhone 16 Pro Max 256GB Desert Titanium",
    titleRu: "iPhone 16 Pro Max 256GB Desert Titanium",
    brandId: "brand_apple",
    brand: {
      id: "brand_apple",
      name: "Apple",
      logo: "",
      description: "Apple Inc.",
      homepageShow: true,
      sortOrder: 1,
      tags: [],
    },
    categoryId: "cat_phones",
    category: {
      id: "cat_phones",
      nameTk: "Smartfonlar",
      nameRu: "Смартфоны",
      slug: "smartphones",
      icon: "smartphone",
      productQuantity: 120,
      actualQuantity: 120,
      sortOrder: 1,
      homepageShow: true,
    },
    tagId: "tag_pre_1",
    tag: { id: "tag_pre_1", nameTk: "Eksklýuziw", nameRu: "Эксклюзив" },
    productId: "prod_iphone16pm",
    product: {
      id: "prod_iphone16pm",
      nameRu: "iPhone 16 Pro Max",
      nameTk: "iPhone 16 Pro Max",
      shortRu: "Новинка 2024",
      shortTk: "Täze model 2024",
      photos: [],
      stock: 0,
      price: 34500,
      oldPrice: 36000,
      brandId: "brand_apple",
      categoryId: "cat_phones",
      unitId: "unit_pcs",
    },
    variantId: "var_iphone16pm_256",
    variant: {
      id: "var_iphone16pm_256",
      productId: "prod_iphone16pm",
      barcode: "194253000001",
      price: "34500",
      oldPrice: "36000",
      stock: 0,
      isActive: true,
      photos: [],
    },
    releaseDate: "2026-09-20",
    targetSize: 50,
    waitingCount: 14,
  },
  {
    id: "pre_2",
    titleTk: "PlayStation 5 Pro",
    titleRu: "PlayStation 5 Pro",
    brandId: "brand_sony",
    brand: {
      id: "brand_sony",
      name: "Sony",
      logo: "",
      description: "Sony Corporation",
      homepageShow: true,
      sortOrder: 2,
      tags: [],
    },
    categoryId: "cat_gaming",
    category: {
      id: "cat_gaming",
      nameTk: "Oýun konsollary",
      nameRu: "Игровые консоли",
      slug: "gaming",
      icon: "gamepad",
      productQuantity: 45,
      actualQuantity: 45,
      sortOrder: 2,
      homepageShow: true,
    },
    tagId: "tag_pre_2",
    tag: { id: "tag_pre_2", nameTk: "Täze Flagman", nameRu: "Новый флагман" },
    productId: "prod_ps5pro",
    product: {
      id: "prod_ps5pro",
      nameRu: "Sony PlayStation 5 Pro",
      nameTk: "Sony PlayStation 5 Pro",
      shortRu: "Консоль нового поколения",
      shortTk: "Täze nesil oýun konsoly",
      photos: [],
      stock: 0,
      price: 18500,
      oldPrice: 19900,
      brandId: "brand_sony",
      categoryId: "cat_gaming",
      unitId: "unit_pcs",
    },
    variantId: "var_ps5pro_2tb",
    variant: {
      id: "var_ps5pro_2tb",
      productId: "prod_ps5pro",
      barcode: "711719570001",
      price: "18500",
      oldPrice: "19900",
      stock: 0,
      isActive: true,
      photos: [],
    },
    releaseDate: "2026-11-10",
    targetSize: 30,
    waitingCount: 8,
  },
];

let mockRequests: PreorderRequestItem[] = [
  {
    id: "req_1",
    seq: 1001,
    preorderId: "pre_1",
    customerId: "cust_1",
    customer: {
      id: "cust_1",
      name: "Ayna Berdiyewa",
      phone: "+993 65 112233",
    },
    preorder: mockPreorders[0],
    depositPercent: 30,
    depositAmount: 10350,
    total: 34500,
    status: "new",
    created: "2026-08-20T14:30:00Z",
  },
  {
    id: "req_2",
    seq: 1002,
    preorderId: "pre_1",
    customerId: "cust_2",
    customer: {
      id: "cust_2",
      name: "Dowlet Hojayew",
      phone: "+993 64 223344",
    },
    preorder: mockPreorders[0],
    depositPercent: 20,
    depositAmount: 6900,
    total: 34500,
    status: "prepay",
    created: "2026-08-21T09:15:00Z",
  },
  {
    id: "req_3",
    seq: 1003,
    preorderId: "pre_2",
    customerId: "cust_3",
    customer: {
      id: "cust_3",
      name: "Batyr Geldiyew",
      phone: "+993 61 778899",
    },
    preorder: mockPreorders[1],
    depositPercent: 50,
    depositAmount: 9250,
    total: 18500,
    status: "ready",
    created: "2026-08-22T16:00:00Z",
  },
];

/* -------------------------------------------------------------------------- */
/*                                1. TAG APIS                                 */
/* -------------------------------------------------------------------------- */

export async function getPreorderTags(
  params?: GetPreorderTagsParams,
): Promise<GetPreorderTagsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    const queryString = query.toString();
    const endpoint = `/preorders/tag-all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.preorderTags && Array.isArray(dataObj.preorderTags)) {
        return {
          count: (dataObj.count as number) ?? dataObj.preorderTags.length,
          preorderTags: dataObj.preorderTags as PreorderTag[],
        };
      }
      if (r?.preorderTags && Array.isArray(r.preorderTags)) {
        return {
          count: (r.count as number) ?? r.preorderTags.length,
          preorderTags: r.preorderTags as PreorderTag[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, preorderTags: r as PreorderTag[] };
      }
      if (Array.isArray(r?.data)) {
        return { count: (r.data as PreorderTag[]).length, preorderTags: r.data as PreorderTag[] };
      }
      return { count: 0, preorderTags: [] };
    });
  }

  let filtered = [...mockTags];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.nameTk?.toLowerCase().includes(s) ||
        t.nameRu?.toLowerCase().includes(s),
    );
  }
  return mockDelay({
    count: filtered.length,
    preorderTags: filtered,
  });
}

export async function getPreorderTagById(
  id: string,
  lang?: string,
): Promise<PreorderTag> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/tag-details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderTag;
    });
  }
  const found = mockTags.find((t) => t.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createPreorderTag(
  input: PreorderTagInput,
  lang?: string,
): Promise<PreorderTag> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/preorders/tag-create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderTag;
    });
  }
  const newTag: PreorderTag = {
    ...input,
    id: `tag_pre_${Date.now()}`,
  };
  mockTags = [newTag, ...mockTags];
  return mockDelay({ ...newTag });
}

export async function updatePreorderTag(
  id: string,
  input: PreorderTagInput,
  lang?: string,
): Promise<PreorderTag> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/tag-edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderTag;
    });
  }
  mockTags = mockTags.map((t) => (t.id === id ? { ...t, ...input } : t));
  const updated = mockTags.find((t) => t.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deletePreorderTag(
  id: string,
  lang?: string,
): Promise<DeletePreorderTagResponse> {
  if (isApiEnabled()) {
    return apiClient<DeletePreorderTagResponse>(`/preorders/tag-delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    });
  }
  mockTags = mockTags.filter((t) => t.id !== id);
  return mockDelay({ deleted: true });
}

/* -------------------------------------------------------------------------- */
/*                              2. PREORDER APIS                              */
/* -------------------------------------------------------------------------- */

export async function getPreordersList(
  params?: GetPreordersParams,
): Promise<GetPreordersResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.brandId) query.set("brandId", params.brandId);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.tagId) query.set("tagId", params.tagId);
    if (params?.productId) query.set("productId", params.productId);

    const queryString = query.toString();
    const endpoint = `/preorders/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.preorders && Array.isArray(dataObj.preorders)) {
        return {
          count: (dataObj.count as number) ?? dataObj.preorders.length,
          preorders: dataObj.preorders as PreorderItem[],
        };
      }
      if (r?.preorders && Array.isArray(r.preorders)) {
        return {
          count: (r.count as number) ?? r.preorders.length,
          preorders: r.preorders as PreorderItem[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, preorders: r as PreorderItem[] };
      }
      if (Array.isArray(r?.data)) {
        return { count: (r.data as PreorderItem[]).length, preorders: r.data as PreorderItem[] };
      }
      return { count: 0, preorders: [] };
    });
  }

  let filtered = [...mockPreorders];
  if (params?.brandId) filtered = filtered.filter((p) => p.brandId === params.brandId);
  if (params?.categoryId) filtered = filtered.filter((p) => p.categoryId === params.categoryId);
  if (params?.tagId) filtered = filtered.filter((p) => p.tagId === params.tagId);
  if (params?.productId) filtered = filtered.filter((p) => p.productId === params.productId);
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.titleTk?.toLowerCase().includes(s) ||
        p.titleRu?.toLowerCase().includes(s) ||
        p.product?.nameRu?.toLowerCase().includes(s) ||
        p.product?.nameTk?.toLowerCase().includes(s),
    );
  }
  return mockDelay({
    count: filtered.length,
    preorders: filtered,
  });
}

export async function getPreorderById(
  id: string,
  lang?: string,
): Promise<PreorderItem> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderItem;
    });
  }
  const found = mockPreorders.find((p) => p.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createPreorder(
  input: PreorderInput,
  lang?: string,
): Promise<PreorderItem> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/preorders/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderItem;
    });
  }
  const newItem: PreorderItem = {
    ...input,
    id: `pre_${Date.now()}`,
    waitingCount: 0,
    tag: mockTags.find((t) => t.id === input.tagId),
  };
  mockPreorders = [newItem, ...mockPreorders];
  return mockDelay({ ...newItem });
}

export async function updatePreorder(
  id: string,
  input: PreorderInput,
  lang?: string,
): Promise<PreorderItem> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderItem;
    });
  }
  mockPreorders = mockPreorders.map((p) =>
    p.id === id
      ? {
          ...p,
          ...input,
          tag: mockTags.find((t) => t.id === input.tagId) || p.tag,
        }
      : p,
  );
  const updated = mockPreorders.find((p) => p.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deletePreorder(
  id: string,
  lang?: string,
): Promise<DeletePreorderResponse> {
  if (isApiEnabled()) {
    return apiClient<DeletePreorderResponse>(`/preorders/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    });
  }
  mockPreorders = mockPreorders.filter((p) => p.id !== id);
  return mockDelay({ deleted: true });
}

/* -------------------------------------------------------------------------- */
/*                          3. PREORDER REQUEST APIS                          */
/* -------------------------------------------------------------------------- */

export async function getPreorderRequests(
  params?: GetPreorderRequestsParams,
): Promise<GetPreorderRequestsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.preorderId) query.set("preorderId", params.preorderId);
    if (params?.customerId) query.set("customerId", params.customerId);

    const queryString = query.toString();
    const endpoint = `/preorders/requests/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.preorderRequests && Array.isArray(dataObj.preorderRequests)) {
        return {
          count: (dataObj.count as number) ?? dataObj.preorderRequests.length,
          preorderRequests: dataObj.preorderRequests as PreorderRequestItem[],
        };
      }
      if (r?.preorderRequests && Array.isArray(r.preorderRequests)) {
        return {
          count: (r.count as number) ?? r.preorderRequests.length,
          preorderRequests: r.preorderRequests as PreorderRequestItem[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, preorderRequests: r as PreorderRequestItem[] };
      }
      if (Array.isArray(r?.data)) {
        return {
          count: (r.data as PreorderRequestItem[]).length,
          preorderRequests: r.data as PreorderRequestItem[],
        };
      }
      return { count: 0, preorderRequests: [] };
    });
  }

  let filtered = [...mockRequests];
  if (params?.status) filtered = filtered.filter((r) => r.status === params.status);
  if (params?.preorderId) filtered = filtered.filter((r) => r.preorderId === params.preorderId);
  if (params?.customerId) filtered = filtered.filter((r) => r.customerId === params.customerId);
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.customer?.name?.toLowerCase().includes(s) ||
        r.customer?.phone?.toLowerCase().includes(s) ||
        r.preorder?.titleTk?.toLowerCase().includes(s) ||
        r.preorder?.titleRu?.toLowerCase().includes(s),
    );
  }
  return mockDelay({
    count: filtered.length,
    preorderRequests: filtered,
  });
}

export async function approvePreorderRequest(
  id: string,
  lang?: string,
): Promise<PreorderRequestItem> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/requests/${id}/approve`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderRequestItem;
    });
  }
  mockRequests = mockRequests.map((r) => (r.id === id ? { ...r, status: "prepay" } : r));
  const updated = mockRequests.find((r) => r.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function rejectPreorderRequest(
  id: string,
  lang?: string,
): Promise<PreorderRequestItem> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/preorders/requests/${id}/reject`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as PreorderRequestItem;
    });
  }
  mockRequests = mockRequests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r));
  const updated = mockRequests.find((r) => r.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}
