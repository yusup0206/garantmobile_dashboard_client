import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminTradein, updateTradeinStatus, deleteTradein } from "./tradein.api";
import type { GetTradeinParams, TradeinStatusKey } from "./tradein.types";

export const tradeinKeys = {
  all: ["tradein"] as const,
  lists: () => [...tradeinKeys.all, "list"] as const,
  list: (params?: GetTradeinParams) => [...tradeinKeys.lists(), params ?? {}] as const,
  customerList: (params?: GetTradeinParams) =>
    [...tradeinKeys.all, "customer", params ?? {}] as const,
};

export function useTradein(params?: GetTradeinParams) {
  return useQuery({
    queryKey: tradeinKeys.list(params),
    queryFn: () => getAdminTradein(params),
  });
}

export function useUpdateTradeinStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TradeinStatusKey }) =>
      updateTradeinStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: tradeinKeys.all }),
  });
}

export function useDeleteTradein() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTradein(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tradeinKeys.all }),
  });
}
