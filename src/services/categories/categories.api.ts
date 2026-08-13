import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  Category,
  CategoryInput,
  GetCategoriesParams,
  GetCategoriesResponse,
  DeleteCategoryResponse,
} from "./categories.types";

/**
 * Category service. Uses /product-category/* endpoints when API is
 * enabled; falls back to a tiny in-memory mock for demo mode.
 */

let store: Category[] = [
  {
    id: "1",
    nameTk: "Smartfonlar",
    nameRu: "Смартфоны",
    slug: "phones",
    productQuantity: 128,
    homepageShow: true,
    sortOrder: 1,
  },
  {
    id: "2",
    nameTk: "Noutbuklar",
    nameRu: "Ноутбуки",
    slug: "laptops",
    productQuantity: 64,
    homepageShow: true,
    sortOrder: 2,
  },
  {
    id: "3",
    nameTk: "Planşetler",
    nameRu: "Планшеты",
    slug: "tablets",
    productQuantity: 37,
    homepageShow: true,
    sortOrder: 3,
  },
  {
    id: "4",
    nameTk: "Telewizorlary",
    nameRu: "Телевизоры",
    slug: "tv",
    productQuantity: 45,
    homepageShow: false,
    sortOrder: 4,
  },
  {
    id: "5",
    nameTk: "Audio",
    nameRu: "Аудио",
    slug: "audio",
    productQuantity: 92,
    homepageShow: false,
    sortOrder: 5,
  },
];

/** Unwrap the standard API envelope */
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r?.data ?? r) as T;
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<GetCategoriesResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.homepageShow !== undefined)
      query.set("homepageShow", String(params.homepageShow));
    const qs = query.toString();
    const endpoint = `/product-category/all${qs ? `?${qs}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: { "Accept-Language": params?.lang || "tk" },
    }).then((res) => {
      const data = unwrap<Record<string, unknown>>(res);
      if (data?.categories && Array.isArray(data.categories)) {
        return {
          count: (data.count as number) ?? (data.categories as Category[]).length,
          categories: data.categories as Category[],
        };
      }
      if (Array.isArray(res)) {
        return { count: (res as Category[]).length, categories: res as Category[] };
      }
      return { count: 0, categories: [] };
    });
  }

  let filtered = [...store];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.nameRu.toLowerCase().includes(q) ||
        c.nameTk.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q),
    );
  }
  if (params?.homepageShow !== undefined) {
    filtered = filtered.filter((c) => c.homepageShow === params.homepageShow);
  }
  return mockDelay({ count: filtered.length, categories: filtered });
}

export async function getCategoryById(id: string, lang = "tk"): Promise<Category> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/product-category/details/${id}`, {
      token: authToken(),
      headers: { "Accept-Language": lang },
    }).then((res) => unwrap<Category>(res));
  }
  const found = store.find((c) => c.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createCategory(
  input: CategoryInput,
  lang = "tk",
): Promise<Category> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/product-category/create", {
      method: "POST",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    }).then((res) => unwrap<Category>(res));
  }
  const category: Category = {
    ...input,
    id: `cat_${Date.now()}`,
    productQuantity: 0,
    actualQuantity: 0,
  };
  store = [category, ...store];
  return mockDelay({ ...category });
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
  lang = "tk",
): Promise<Category> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/product-category/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: { "Accept-Language": lang },
      body: JSON.stringify(input),
    }).then((res) => unwrap<Category>(res));
  }
  store = store.map((c) => (c.id === id ? { ...c, ...input } : c));
  const updated = store.find((c) => c.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteCategory(
  id: string,
  lang = "tk",
): Promise<DeleteCategoryResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteCategoryResponse>(`/product-category/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: { "Accept-Language": lang },
    });
  }
  store = store.filter((c) => c.id !== id);
  return mockDelay({ deleted: true });
}
