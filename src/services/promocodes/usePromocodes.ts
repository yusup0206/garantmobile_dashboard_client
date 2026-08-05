import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPromocode,
  deletePromocode,
  getPromocodes,
  updatePromocode,
} from "./promocodes.api";
import type { PromocodeInput } from "./promocodes.types";

export const promocodesKeys = {
  all: ["promocodes"] as const,
};

export function usePromocodes() {
  return useQuery({ queryKey: promocodesKeys.all, queryFn: getPromocodes });
}

export function useCreatePromocode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PromocodeInput) => createPromocode(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: promocodesKeys.all }),
  });
}

export function useUpdatePromocode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, input }: { code: string; input: PromocodeInput }) =>
      updatePromocode(code, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: promocodesKeys.all }),
  });
}

export function useDeletePromocode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => deletePromocode(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: promocodesKeys.all }),
  });
}
