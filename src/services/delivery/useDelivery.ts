import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeliveryType,
  deleteDeliveryType,
  getDeliveryTypeById,
  getDeliveryTypes,
  updateDeliveryType,
} from "./delivery.api";
import type { DeliveryTypeInput, GetDeliveryTypesParams } from "./delivery.types";

export const deliveryKeys = {
  all: ["delivery"] as const,
  list: (params?: GetDeliveryTypesParams) => ["delivery", "list", params] as const,
  detail: (id: string, lang?: string) => ["delivery", "detail", id, lang] as const,
};

export function useDelivery(params?: GetDeliveryTypesParams) {
  return useQuery({
    queryKey: deliveryKeys.list(params),
    queryFn: () => getDeliveryTypes(params),
  });
}

export function useDeliveryTypeDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: deliveryKeys.detail(id ?? "", lang),
    queryFn: () => getDeliveryTypeById(id!, lang),
    enabled: !!id,
  });
}

export function useCreateDeliveryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: DeliveryTypeInput; lang?: string }) =>
      createDeliveryType(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useUpdateDeliveryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: DeliveryTypeInput;
      lang?: string;
    }) => updateDeliveryType(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useDeleteDeliveryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteDeliveryType(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}
