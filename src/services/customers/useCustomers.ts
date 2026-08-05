import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adjustCustomerBonus, getCustomerBonuses, getCustomers } from "./customers.api";
import type { AdjustBonusInput } from "./customers.types";

export const customersKeys = {
  all: ["customers"] as const,
  bonuses: (id: number) => ["customers", id, "bonuses"] as const,
};

export function useCustomers() {
  return useQuery({ queryKey: customersKeys.all, queryFn: getCustomers });
}

/** One customer's loyalty ledger; only fetched when a customer is selected. */
export function useCustomerBonuses(id: number | null) {
  return useQuery({
    queryKey: customersKeys.bonuses(id ?? 0),
    queryFn: () => getCustomerBonuses(id as number),
    enabled: id !== null,
  });
}

/** Apply a manual bonus correction and refresh the list + that ledger. */
export function useAdjustBonus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: AdjustBonusInput }) =>
      adjustCustomerBonus(id, input),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: customersKeys.all });
      void qc.invalidateQueries({ queryKey: customersKeys.bonuses(id) });
    },
  });
}
