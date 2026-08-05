import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBanner, deleteBanner, getBanners, updateBanner } from "./banners.api";
import type { BannerInput } from "./banners.types";

export const bannersKeys = {
  all: ["banners"] as const,
  list: ["banners", "list"] as const,
};

export function useBanners() {
  return useQuery({ queryKey: bannersKeys.list, queryFn: getBanners });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BannerInput) => createBanner(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannersKeys.all }),
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BannerInput }) =>
      updateBanner(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannersKeys.all }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannersKeys.all }),
  });
}
