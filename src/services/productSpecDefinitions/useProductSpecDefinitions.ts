import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductSpecDefinition,
  deleteProductSpecDefinition,
  getProductSpecDefinitionById,
  getProductSpecDefinitions,
  updateProductSpecDefinition,
} from "./productSpecDefinitions.api";
import type {
  GetProductSpecDefinitionsParams,
  ProductSpecDefinitionInput,
} from "./productSpecDefinitions.types";

export const productSpecDefinitionsKeys = {
  all: ["productSpecDefinitions"] as const,
  list: (params?: GetProductSpecDefinitionsParams) =>
    ["productSpecDefinitions", "list", params] as const,
  detail: (id: string) => ["productSpecDefinitions", "detail", id] as const,
};

export function useProductSpecDefinitions(
  params?: GetProductSpecDefinitionsParams,
) {
  return useQuery({
    queryKey: productSpecDefinitionsKeys.list(params),
    queryFn: () => getProductSpecDefinitions(params),
  });
}

export function useProductSpecDefinitionDetail(id?: string) {
  return useQuery({
    queryKey: productSpecDefinitionsKeys.detail(id ?? ""),
    queryFn: () => getProductSpecDefinitionById(id!),
    enabled: !!id,
  });
}

export function useCreateProductSpecDefinition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductSpecDefinitionInput) =>
      createProductSpecDefinition(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecDefinitionsKeys.all }),
  });
}

export function useUpdateProductSpecDefinition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProductSpecDefinitionInput;
    }) => updateProductSpecDefinition(id, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecDefinitionsKeys.all }),
  });
}

export function useDeleteProductSpecDefinition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductSpecDefinition(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productSpecDefinitionsKeys.all }),
  });
}
