import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockCustomer, getCustomers } from "./customers.api";
import type { GetCustomersParams } from "./customers.types";

export const customersKeys = {
  all: ["customers"] as const,
  list: (params?: GetCustomersParams) => ["customers", "list", params] as const,
};

export function useCustomers(params?: GetCustomersParams) {
  return useQuery({
    queryKey: customersKeys.list(params),
    queryFn: () => getCustomers(params),
  });
}

export function useBlockCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => blockCustomer(customerId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: customersKeys.all });
    },
  });
}
