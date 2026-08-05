import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentTypes,
  getPaymentTypeDetails,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
} from "./payments.api";
import type { GetPaymentTypesParams, PaymentTypeInput } from "./payments.types";

export const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
  list: (params?: GetPaymentTypesParams) => [...paymentsKeys.lists(), params] as const,
  details: () => [...paymentsKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
};

export function usePayments(params?: GetPaymentTypesParams) {
  return useQuery({
    queryKey: paymentsKeys.list(params),
    queryFn: () => getPaymentTypes(params),
  });
}

export function usePaymentTypeDetails(id: string, lang?: string) {
  return useQuery({
    queryKey: paymentsKeys.detail(id),
    queryFn: () => getPaymentTypeDetails(id, lang),
    enabled: Boolean(id),
  });
}

export function useCreatePaymentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: PaymentTypeInput; lang?: string }) =>
      createPaymentType(input, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}

export function useUpdatePaymentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: PaymentTypeInput;
      lang?: string;
    }) => updatePaymentType(id, input, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}

export function useDeletePaymentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deletePaymentType(id, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
