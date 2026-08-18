import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductVariant,
  deleteProductVariant,
  getProductVariantById,
  getProductVariants,
  updateProductVariant,
} from "./productVariants.api";
import type {
  GetProductVariantsParams,
  ProductVariantInput,
} from "./productVariants.types";

export const productVariantsKeys = {
  all: ["productVariants"] as const,
  list: (params?: GetProductVariantsParams) =>
    ["productVariants", "list", params] as const,
  detail: (id: string) => ["productVariants", "detail", id] as const,
};

export function useProductVariants(params?: GetProductVariantsParams) {
  return useQuery({
    queryKey: productVariantsKeys.list(params),
    queryFn: () => getProductVariants(params),
    enabled: !!params?.productId,
  });
}

export function useProductVariantDetail(id?: string) {
  return useQuery({
    queryKey: productVariantsKeys.detail(id ?? ""),
    queryFn: () => getProductVariantById(id!),
    enabled: !!id,
  });
}

export function useCreateProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductVariantInput) => createProductVariant(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productVariantsKeys.all }),
  });
}

export function useUpdateProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductVariantInput }) =>
      updateProductVariant(id, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productVariantsKeys.all }),
  });
}

export function useDeleteProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductVariant(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productVariantsKeys.all }),
  });
}
