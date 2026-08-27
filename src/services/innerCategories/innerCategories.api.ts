import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  InnerCategory,
  InnerCategoryInput,
  GetInnerCategoriesParams,
  GetInnerCategoriesResponse,
  DeleteInnerCategoryResponse,
} from "./innerCategories.types";

let mockStore: InnerCategory[] = [
  {
    id: "clg1x0z5e0000v6l3f4b7j2k1",
    name: "Флагманы 2024",
    categorySpecs: [
      { id: "spec_1", nameRu: "Цвет", nameTk: "Reňk" },
      { id: "spec_2", nameRu: "Память", nameTk: "Ýat" },
    ],
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k2",
    name: "Ноутбуки Pro",
    categorySpecs: [
      { id: "spec_3", nameRu: "Процессор", nameTk: "Prosessor" },
      { id: "spec_4", nameRu: "Оперативная память", nameTk: "Operatiw ýat" },
    ],
  },
];

export async function getInnerCategories(
  params?: GetInnerCategoriesParams,
): Promise<GetInnerCategoriesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString();
    const endpoint = `/inner-category/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.innerCategories && Array.isArray(dataObj.innerCategories)) {
        return {
          count: (dataObj.count as number) ?? dataObj.innerCategories.length,
          innerCategories: dataObj.innerCategories as InnerCategory[],
        };
      }
      if (r?.innerCategories && Array.isArray(r.innerCategories)) {
        return {
          count: (r.count as number) ?? r.innerCategories.length,
          innerCategories: r.innerCategories as InnerCategory[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, innerCategories: r as InnerCategory[] };
      }
      if (Array.isArray(r?.data)) {
        return {
          count: (r.data as InnerCategory[]).length,
          innerCategories: r.data as InnerCategory[],
        };
      }
      return { count: 0, innerCategories: [] };
    });
  }

  let filtered = [...mockStore];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(s));
  }
  return mockDelay({
    count: filtered.length,
    innerCategories: filtered,
  });
}

export async function getInnerCategoryById(
  id: string,
  lang?: string,
): Promise<InnerCategory> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/inner-category/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as InnerCategory;
    });
  }
  const found = mockStore.find((c) => c.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createInnerCategory(
  input: InnerCategoryInput,
  lang?: string,
): Promise<InnerCategory> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/inner-category/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as InnerCategory;
    });
  }
  const newItem: InnerCategory = {
    id: `inc_${Date.now()}`,
    name: input.name,
    categorySpecs: input.specIds.map((id) => ({
      id,
      nameRu: `Спецификация ${id.slice(0, 4)}`,
      nameTk: `Häsiýetnama ${id.slice(0, 4)}`,
    })),
  };
  mockStore = [newItem, ...mockStore];
  return mockDelay({ ...newItem });
}

export async function updateInnerCategory(
  id: string,
  input: InnerCategoryInput,
  lang?: string,
): Promise<InnerCategory> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/inner-category/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as InnerCategory;
    });
  }
  mockStore = mockStore.map((c) =>
    c.id === id
      ? {
          ...c,
          name: input.name,
          categorySpecs: input.specIds.map((sid) => ({
            id: sid,
            nameRu: `Спецификация ${sid.slice(0, 4)}`,
            nameTk: `Häsiýetnama ${sid.slice(0, 4)}`,
          })),
        }
      : c,
  );
  const updated = mockStore.find((c) => c.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteInnerCategory(
  id: string,
  lang?: string,
): Promise<DeleteInnerCategoryResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteInnerCategoryResponse>(`/inner-category/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang || "tk" },
    });
  }
  mockStore = mockStore.filter((c) => c.id !== id);
  return mockDelay({ deleted: true });
}
