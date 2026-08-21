import { env } from "@/config/env";
import type { RequestOptions } from "./api.types";

import { useLangStore } from "@/store/i18n.store";

/**
 * Thin fetch wrapper. Never call fetch directly from components — go through a
 * feature API in services/<feature>/*.api.ts, which uses this client.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const currentLang = useLangStore.getState().lang;

  const response = await fetch(env.apiBaseUrl + endpoint, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": currentLang,
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...headers,
    },
  });

  if (response.status === 401) {
    const isLoginEndpoint = endpoint.includes("/login");
    if (!isLoginEndpoint) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new Error("API Error: 401 Unauthorized");
  }

  if (!response.ok) {
    throw new Error("API Error: " + response.status);
  }

  // 204 No Content (e.g. DELETE) has an empty body — nothing to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Simulate network latency for the mock data layer. */
export function mockDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
