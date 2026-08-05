import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, getRecentOrders, updateOrderStatus } from "./orders.api";
import type { OrderStatusKey } from "./orders.types";

export const ordersKeys = {
  all: ["orders"] as const,
  recent: (limit: number) => ["orders", "recent", limit] as const,
};

export function useOrders() {
  return useQuery({ queryKey: ordersKeys.all, queryFn: getOrders });
}

export function useRecentOrders(limit = 6) {
  return useQuery({
    queryKey: ordersKeys.recent(limit),
    queryFn: () => getRecentOrders(limit),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ num, st }: { num: string; st: OrderStatusKey }) =>
      updateOrderStatus(num, st),
    // Invalidating the ["orders"] prefix covers both the list and the recent key.
    onSuccess: () => qc.invalidateQueries({ queryKey: ordersKeys.all }),
  });
}
