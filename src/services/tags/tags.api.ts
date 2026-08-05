import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  Tag,
  TagInput,
  GetTagsParams,
  GetTagsResponse,
  DeleteTagResponse,
} from "./tags.types";

let store: Tag[] = [];

export async function getTags(params?: GetTagsParams): Promise<GetTagsResponse> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);
    if (params?.brandId) query.set("brandId", params.brandId);

    const queryString = query.toString();
    const endpoint = `/tags/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.tags && Array.isArray(dataObj.tags)) {
        return {
          count: (dataObj.count as number) ?? (dataObj.tags as Tag[]).length,
          tags: dataObj.tags as Tag[],
        };
      }
      if (r?.tags && Array.isArray(r.tags)) {
        return {
          count: (r.count as number) ?? (r.tags as Tag[]).length,
          tags: r.tags as Tag[],
        };
      }
      if (Array.isArray(r)) {
        return { count: r.length, tags: r as Tag[] };
      }
      if (Array.isArray(r?.data)) {
        return { count: (r.data as Tag[]).length, tags: r.data as Tag[] };
      }
      return { count: 0, tags: [] };
    });
  }

  let filtered = [...store];
  if (params?.brandId) {
    filtered = filtered.filter((t) => t.brandId === params.brandId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.nameRu?.toLowerCase().includes(q) ||
        t.nameTk?.toLowerCase().includes(q),
    );
  }

  return mockDelay({
    count: filtered.length,
    tags: filtered,
  });
}

export async function getTagById(id: string, lang?: string): Promise<Tag> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/tags/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as Tag;
    });
  }
  const found = store.find((t) => t.id === id);
  if (!found) throw new Error("error.notFound");
  return mockDelay({ ...found });
}

export async function createTag(input: TagInput, lang?: string): Promise<Tag> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/tags/create", {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as Tag;
    });
  }
  const tag: Tag = {
    ...input,
    id: `tag_${Date.now()}`,
  };
  store = [tag, ...store];
  return mockDelay({ ...tag });
}

export async function updateTag(
  id: string,
  input: TagInput,
  lang?: string,
): Promise<Tag> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/tags/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(input),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as Tag;
    });
  }
  store = store.map((t) => (t.id === id ? { ...t, ...input } : t));
  const updated = store.find((t) => t.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export async function deleteTag(id: string, lang?: string): Promise<DeleteTagResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteTagResponse>(`/tags/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    });
  }
  store = store.filter((t) => t.id !== id);
  return mockDelay({ deleted: true });
}
