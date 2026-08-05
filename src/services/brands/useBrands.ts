import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrand, deleteBrand, getBrands, updateBrand } from "./brands.api";
import type { BrandInput } from "./brands.types";

export const brandsKeys = {
  all: ["brands"] as const,
};

export function useBrands() {
  return useQuery({ queryKey: brandsKeys.all, queryFn: getBrands });
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
    mutationFn: ({ id, input }: { id: number; input: BrandInput }) =>
      updateBrand(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandsKeys.all }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: brandsKeys.all }),
  });
}
