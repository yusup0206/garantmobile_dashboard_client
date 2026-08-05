import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnit, deleteUnit, getUnits, updateUnit } from "./units.api";
import type { UnitInput } from "./units.types";

export const unitsKeys = {
  all: ["units"] as const,
};

export function useUnits() {
  return useQuery({ queryKey: unitsKeys.all, queryFn: getUnits });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UnitInput) => createUnit(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UnitInput }) =>
      updateUnit(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUnit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}
