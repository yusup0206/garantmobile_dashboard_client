import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "./brands.api";
import type { BrandInput, GetBrandsParams } from "./brands.types";

export const brandsKeys = {
  all: ["brands"] as const,
  list: (params?: GetBrandsParams) => ["brands", "list", params] as const,
  detail: (id: string) => ["brands", "detail", id] as const,
};

export function useBrands(params?: GetBrandsParams) {
  return useQuery({
    queryKey: brandsKeys.list(params),
    queryFn: () => getBrands(params),
  });
}

export function useBrandDetail(id?: string) {
  return useQuery({
    queryKey: brandsKeys.detail(id ?? ""),
    queryFn: () => getBrandById(id!),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BrandInput) => createBrand(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandsKeys.all }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BrandInput }) =>
      updateBrand(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandsKeys.all }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandsKeys.all }),
  });
}
