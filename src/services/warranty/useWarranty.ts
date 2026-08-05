import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWarrantyClaims, updateWarrantyStatus } from "./warranty.api";
import type { WarrantyStatusKey } from "./warranty.types";

export const warrantyKeys = {
  all: ["warranty"] as const,
};

export function useWarrantyClaims() {
  return useQuery({ queryKey: warrantyKeys.all, queryFn: getWarrantyClaims });
}

export function useUpdateWarrantyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, st }: { id: string; st: WarrantyStatusKey }) =>
      updateWarrantyStatus(id, st),
    onSuccess: () => qc.invalidateQueries({ queryKey: warrantyKeys.all }),
  });
}
