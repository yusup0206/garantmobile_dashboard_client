import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrderDetails,
  getRecentOrders,
  updateOrderStatus,
} from "./orders.api";
import type { GetOrdersParams, OrderStatusKey } from "./orders.types";

export const ordersKeys = {
  all: ["orders"] as const,
  list: (params?: GetOrdersParams) => ["orders", "list", params] as const,
  details: (id: string, lang?: string) => ["orders", "details", id, lang] as const,
  recent: (limit: number) => ["orders", "recent", limit] as const,
};

export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ordersKeys.list(params),
    queryFn: () => getOrders(params),
  });
}

export function useOrderDetails(id?: string, lang?: string) {
  return useQuery({
    queryKey: ordersKeys.details(id ?? "", lang),
    queryFn: () => (id ? getOrderDetails(id, lang) : Promise.reject("No ID")),
    enabled: Boolean(id),
  });
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
    mutationFn: ({
      id,
      status,
      lang,
    }: {
      id: string;
      status: OrderStatusKey;
      lang?: string;
    }) => updateOrderStatus(id, status, lang),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
