import { env } from "@/config/env";
import type { RequestOptions } from "./api.types";

/**
 * Thin fetch wrapper. Never call fetch directly from components — go through a
 * feature API in services/<feature>/*.api.ts, which uses this client.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(env.apiBaseUrl + endpoint, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...headers,
    },
  });

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
