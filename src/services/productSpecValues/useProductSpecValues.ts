import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductSpecValue,
  deleteProductSpecValue,
  getProductSpecValues,
  updateProductSpecValue,
} from "./productSpecValues.api";
import type {
  GetProductSpecValuesParams,
  ProductSpecValueInput,
} from "./productSpecValues.types";

export const productSpecValuesKeys = {
  all: ["productSpecValues"] as const,
  list: (params?: GetProductSpecValuesParams) =>
    ["productSpecValues", "list", params] as const,
  detail: (id: string) => ["productSpecValues", "detail", id] as const,
};

export function useProductSpecValues(params?: GetProductSpecValuesParams) {
  return useQuery({
    queryKey: productSpecValuesKeys.list(params),
    queryFn: () => getProductSpecValues(params),
    enabled: !!params?.specId,
  });
}

export function useCreateProductSpecValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductSpecValueInput) =>
      createProductSpecValue(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecValuesKeys.all }),
  });
}

export function useUpdateProductSpecValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProductSpecValueInput;
    }) => updateProductSpecValue(id, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecValuesKeys.all }),
  });
}

export function useDeleteProductSpecValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductSpecValue(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecValuesKeys.all }),
  });
}
