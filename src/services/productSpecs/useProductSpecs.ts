import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductSpec,
  deleteProductSpec,
  getProductSpecById,
  getProductSpecs,
  updateProductSpec,
} from "./productSpecs.api";
import type {
  GetProductSpecsParams,
  ProductSpecInput,
} from "./productSpecs.types";

export const productSpecsKeys = {
  all: ["productSpecs"] as const,
  list: (params?: GetProductSpecsParams) =>
    ["productSpecs", "list", params] as const,
  detail: (id: string) => ["productSpecs", "detail", id] as const,
};

export function useProductSpecs(params?: GetProductSpecsParams) {
  return useQuery({
    queryKey: productSpecsKeys.list(params),
    queryFn: () => getProductSpecs(params),
    enabled: !!params?.productId,
  });
}

export function useProductSpecDetail(id?: string) {
  return useQuery({
    queryKey: productSpecsKeys.detail(id ?? ""),
    queryFn: () => getProductSpecById(id!),
    enabled: !!id,
  });
}

export function useCreateProductSpec() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductSpecInput) => createProductSpec(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productSpecsKeys.all }),
  });
}

export function useUpdateProductSpec() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductSpecInput }) =>
      updateProductSpec(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productSpecsKeys.all }),
  });
}

export function useDeleteProductSpec() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductSpec(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productSpecsKeys.all }),
  });
}
