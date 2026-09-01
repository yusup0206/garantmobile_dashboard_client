import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReviews, updateReviewStatus } from "./reviews.api";
import type { GetReviewsParams, ReviewStatusKey } from "./reviews.types";

export const reviewsKeys = {
  all: ["reviews"] as const,
  list: (params?: GetReviewsParams) => ["reviews", "list", params] as const,
};

export function useReviews(params?: GetReviewsParams) {
  return useQuery({
    queryKey: reviewsKeys.list(params),
    queryFn: () => getReviews(params),
  });
}

export function useUpdateReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatusKey }) =>
      updateReviewStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewsKeys.all }),
  });
}

