import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductOption,
  deleteProductOption,
  getProductOptionById,
  getProductOptions,
  updateProductOption,
} from "./productOptions.api";
import type {
  GetProductOptionsParams,
  ProductOptionInput,
} from "./productOptions.types";

export const productOptionsKeys = {
  all: ["productOptions"] as const,
  list: (params?: GetProductOptionsParams) =>
    ["productOptions", "list", params] as const,
  detail: (id: string) => ["productOptions", "detail", id] as const,
};

export function useProductOptions(params?: GetProductOptionsParams) {
  return useQuery({
    queryKey: productOptionsKeys.list(params),
    queryFn: () => getProductOptions(params),
    enabled: !!params?.productId,
  });
}

export function useProductOptionDetail(id?: string) {
  return useQuery({
    queryKey: productOptionsKeys.detail(id ?? ""),
    queryFn: () => getProductOptionById(id!),
    enabled: !!id,
  });
}

export function useCreateProductOption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductOptionInput) => createProductOption(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productOptionsKeys.all }),
  });
}

export function useUpdateProductOption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductOptionInput }) =>
      updateProductOption(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: productOptionsKeys.all }),
  });
}

export function useDeleteProductOption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductOption(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productOptionsKeys.all }),
  });
}
