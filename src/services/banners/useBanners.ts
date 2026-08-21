import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./banners.api";
import type { BannerInput, GetBannersParams } from "./banners.types";

export const bannersKeys = {
  all: ["banners"] as const,
  list: (params?: GetBannersParams) => ["banners", "list", params] as const,
};

export function useBanners(params?: GetBannersParams) {
  return useQuery({
    queryKey: bannersKeys.list(params),
    queryFn: () => getBanners(params),
  });
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
