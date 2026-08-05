import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTradeinRequests, updateTradeinStatus } from "./tradein.api";
import type { TradeinStatusKey } from "./tradein.types";

export const tradeinKeys = {
  all: ["tradein"] as const,
};

export function useTradein() {
  return useQuery({ queryKey: tradeinKeys.all, queryFn: getTradeinRequests });
}

export function useUpdateTradeinStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, st }: { id: string; st: TradeinStatusKey }) =>
      updateTradeinStatus(id, st),
    onSuccess: () => qc.invalidateQueries({ queryKey: tradeinKeys.all }),
  });
}
