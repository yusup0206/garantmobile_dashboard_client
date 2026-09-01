import { apiClient } from "@/services/api/apiClient";
import { authToken } from "@/services/api/authToken";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  ReviewStatusKey,
} from "./reviews.types";

const BASE = "/reviews";

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
  return apiClient<GetReviewsResponse>(url, { token: authToken() });
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatusKey,
): Promise<Review> {
  return apiClient<Review>(`${BASE}/${id}/status`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify({ status }),
  });
}


