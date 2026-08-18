import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductOptionValue,
  deleteProductOptionValue,
  getProductOptionValueById,
  getProductOptionValues,
  updateProductOptionValue,
} from "./productOptionValues.api";
import type {
  GetProductOptionValuesParams,
  ProductOptionValueInput,
} from "./productOptionValues.types";

export const productOptionValuesKeys = {
  all: ["productOptionValues"] as const,
  list: (params?: GetProductOptionValuesParams) =>
    ["productOptionValues", "list", params] as const,
  detail: (id: string) => ["productOptionValues", "detail", id] as const,
};

export function useProductOptionValues(params?: GetProductOptionValuesParams) {
  return useQuery({
    queryKey: productOptionValuesKeys.list(params),
    queryFn: () => getProductOptionValues(params),
    enabled: !!params?.optionId,
  });
}

export function useProductOptionValueDetail(id?: string) {
  return useQuery({
    queryKey: productOptionValuesKeys.detail(id ?? ""),
    queryFn: () => getProductOptionValueById(id!),
    enabled: !!id,
  });
}

export function useCreateProductOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductOptionValueInput) =>
      createProductOptionValue(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productOptionValuesKeys.all }),
  });
}

export function useUpdateProductOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProductOptionValueInput;
    }) => updateProductOptionValue(id, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productOptionValuesKeys.all }),
  });
}

export function useDeleteProductOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductOptionValue(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productOptionValuesKeys.all }),
  });
}
