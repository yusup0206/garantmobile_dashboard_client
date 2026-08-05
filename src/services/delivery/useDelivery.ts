import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShipments, updateShipmentStatus } from "./delivery.api";
import type { DeliveryStatusKey } from "./delivery.types";

export const deliveryKeys = {
  all: ["delivery"] as const,
};

export function useDelivery() {
  return useQuery({ queryKey: deliveryKeys.all, queryFn: getShipments });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, st }: { id: string; st: DeliveryStatusKey }) =>
      updateShipmentStatus(id, st),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}
