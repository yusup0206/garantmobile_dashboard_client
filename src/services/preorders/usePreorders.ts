import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPreorders, updatePreorderStatus } from "./preorders.api";
import type { PreorderStatusKey } from "./preorders.types";

export const preordersKeys = {
  all: ["preorders"] as const,
};

export function usePreorders() {
  return useQuery({ queryKey: preordersKeys.all, queryFn: getPreorders });
}

export function useUpdatePreorderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ num, st }: { num: string; st: PreorderStatusKey }) =>
      updatePreorderStatus(num, st),
    onSuccess: () => qc.invalidateQueries({ queryKey: preordersKeys.all }),
  });
}
