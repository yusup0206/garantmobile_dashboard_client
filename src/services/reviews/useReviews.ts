import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReviews, updateReviewStatus } from "./reviews.api";
import type { ReviewStatusKey } from "./reviews.types";

export const reviewsKeys = {
  all: ["reviews"] as const,
};

export function useReviews() {
  return useQuery({ queryKey: reviewsKeys.all, queryFn: getReviews });
}

export function useUpdateReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, st }: { id: number; st: ReviewStatusKey }) =>
      updateReviewStatus(id, st),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewsKeys.all }),
  });
}
