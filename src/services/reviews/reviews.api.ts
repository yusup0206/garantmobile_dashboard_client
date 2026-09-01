import { apiClient } from "@/services/api/apiClient";
import { authToken } from "@/services/api/authToken";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  ReviewStatusKey,
} from "./reviews.types";

const BASE = "/reviews";

/** Unwrap standard { statusCode, success, data: ... } backend response envelope */
function unwrap<T>(res: unknown): T {
  const r = res as Record<string, unknown>;
  return (r && "data" in r && r.data !== undefined ? r.data : r) as T;
}

export async function getReviews(
  params?: GetReviewsParams,
): Promise<GetReviewsResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.status) qs.set("status", params.status);
  if (params?.productId) qs.set("productId", params.productId);
  if (params?.customerId) qs.set("customerId", params.customerId);
  const query = qs.toString();
  const url = query ? `${BASE}?${query}` : BASE;
  const res = await apiClient<unknown>(url, { token: authToken() });
  const data = unwrap<GetReviewsResponse>(res);
  return {
    count: data?.count ?? (data?.reviews ? data.reviews.length : 0),
    reviews: data?.reviews ?? [],
  };
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatusKey,
): Promise<Review> {
  const res = await apiClient<unknown>(`${BASE}/${id}/status`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify({ status }),
  });
  return unwrap<Review>(res);
}
