import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adjustStock, getMovements } from "./inventory.api";
import type { AdjustStockInput, MovementsQuery } from "./inventory.types";

export const inventoryKeys = {
  all: ["inventory", "movements"] as const,
  movements: (query: MovementsQuery) => ["inventory", "movements", query] as const,
};

export function useMovements(query: MovementsQuery = {}) {
  return useQuery({
    queryKey: inventoryKeys.movements(query),
    queryFn: () => getMovements(query),
  });
}

/** Apply a manual stock adjustment and refresh the ledger. */
export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AdjustStockInput) => adjustStock(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.all }),
  });
}
