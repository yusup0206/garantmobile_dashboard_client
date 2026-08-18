import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPromocode,
  deletePromocode,
  getPromocodes,
  updatePromocode,
} from "./promocodes.api";
import type { GetPromocodesParams, PromocodeInput } from "./promocodes.types";

export const promocodesKeys = {
  all: ["promocodes"] as const,
  list: (params: GetPromocodesParams) => ["promocodes", "list", params] as const,
};

export function usePromocodes(params: GetPromocodesParams = {}) {
  return useQuery({
    queryKey: promocodesKeys.list(params),
    queryFn: () => getPromocodes(params),
  });
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
    mutationFn: ({ id, input }: { id: string; input: PromocodeInput }) =>
      updatePromocode(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: promocodesKeys.all }),
  });
}

export function useDeletePromocode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePromocode(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: promocodesKeys.all }),
  });
}
