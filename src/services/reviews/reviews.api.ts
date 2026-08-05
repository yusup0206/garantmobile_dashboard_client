import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { REVIEWS } from "@/data/reviews.mock";
import type { Review, ReviewStatusKey } from "./reviews.types";

/**
 * Reviews API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Review[] = REVIEWS.map((r) => ({ ...r }));

export function getReviews(): Promise<Review[]> {
  if (isApiEnabled()) {
    return apiClient<Review[]>("/reviews", { token: authToken() });
  }
  return mockDelay(store.map((r) => ({ ...r })));
}

export function updateReviewStatus(id: number, st: ReviewStatusKey): Promise<Review> {
  if (isApiEnabled()) {
    return apiClient<Review>(`/reviews/${id}/status`, {
      method: "PATCH",
      token: authToken(),
      body: JSON.stringify({ status: st }),
    });
  }
  store = store.map((r) => (r.id === id ? { ...r, st } : r));
  const updated = store.find((r) => r.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

