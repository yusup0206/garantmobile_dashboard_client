import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVariantOptionValue,
  deleteVariantOptionValue,
  getVariantOptionValues,
  updateVariantOptionValue,
} from "./productVariantOptionValues.api";
import type { GetVariantOptionValuesParams } from "./productVariantOptionValues.types";

export const variantOptionValuesKeys = {
  all: ["variantOptionValues"] as const,
  list: (params?: GetVariantOptionValuesParams) =>
    ["variantOptionValues", "list", params] as const,
};

export function useVariantOptionValues(params?: GetVariantOptionValuesParams) {
  return useQuery({
    queryKey: variantOptionValuesKeys.list(params),
    queryFn: () => getVariantOptionValues(params),
    enabled: !!params?.variantId,
  });
}

export function useAttachVariantOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { variantId: string; optionValueId: string }) =>
      createVariantOptionValue(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: variantOptionValuesKeys.all }),
  });
}

export function useReplaceVariantOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      oldOptionValueId,
      newOptionValueId,
    }: {
      variantId: string;
      oldOptionValueId: string;
      newOptionValueId: string;
    }) => updateVariantOptionValue(variantId, oldOptionValueId, newOptionValueId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: variantOptionValuesKeys.all }),
  });
}

export function useDetachVariantOptionValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      optionValueId,
    }: {
      variantId: string;
      optionValueId: string;
    }) => deleteVariantOptionValue(variantId, optionValueId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: variantOptionValuesKeys.all }),
  });
}
