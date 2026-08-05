import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { FAQ_ENTRIES } from "@/data/faq.mock";
import type {
  FaqEntry,
  CreateFaqDto,
  EditFaqDto,
  GetFaqParams,
  DeleteFaqResponse,
} from "./faq.types";

export function getAllFaq(params?: GetFaqParams): Promise<FaqEntry[]> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (typeof params?.isPublished === "boolean") {
      query.set("isPublished", String(params.isPublished));
    }
    if (typeof params?.chatVisible === "boolean") {
      query.set("chatVisible", String(params.chatVisible));
    }
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString();
    const endpoint = `/faq/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<any>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res) => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data?.faqs)) return res.data.faqs;
      if (Array.isArray(res?.faqs)) return res.faqs;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.items)) return res.items;
      if (Array.isArray(res?.faq)) return res.faq;
      return [];
    });
  }
  return mockDelay(FAQ_ENTRIES);
}

export function getFaqById(id: string, lang?: string): Promise<FaqEntry> {
  if (isApiEnabled()) {
    return apiClient<FaqEntry>(`/faq/details/${id}`, {
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
    });
  }
  const item = FAQ_ENTRIES.find((f) => f.id === id);
  if (!item) return Promise.reject(new Error("FAQ not found"));
  return mockDelay(item);
}

export function createFaq(data: CreateFaqDto, lang?: string): Promise<FaqEntry> {
  if (isApiEnabled()) {
    return apiClient<FaqEntry>("/faq/create", {
      method: "POST",
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
      body: JSON.stringify(data),
    });
  }
  const newEntry: FaqEntry = {
    ...data,
    id: "mock-" + Date.now(),
    created: new Date().toISOString(),
  };
  FAQ_ENTRIES.push(newEntry);
  return mockDelay(newEntry);
}

export function editFaq(id: string, data: EditFaqDto, lang?: string): Promise<FaqEntry> {
  if (isApiEnabled()) {
    return apiClient<FaqEntry>(`/faq/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
      body: JSON.stringify(data),
    });
  }
  const index = FAQ_ENTRIES.findIndex((f) => f.id === id);
  if (index !== -1) {
    FAQ_ENTRIES[index] = { ...FAQ_ENTRIES[index], ...data };
    return mockDelay(FAQ_ENTRIES[index]);
  }
  return Promise.reject(new Error("FAQ not found"));
}

export function deleteFaq(id: string, lang?: string): Promise<DeleteFaqResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteFaqResponse>(`/faq/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: lang ? { "Accept-Language": lang } : undefined,
    });
  }
  const index = FAQ_ENTRIES.findIndex((f) => f.id === id);
  if (index !== -1) {
    FAQ_ENTRIES.splice(index, 1);
  }
  return mockDelay({ deleted: true });
}
