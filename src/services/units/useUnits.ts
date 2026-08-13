import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnit, deleteUnit, getUnitById, getUnits, updateUnit } from "./units.api";
import type { GetUnitsParams, UnitInput } from "./units.types";

export const unitsKeys = {
  all: ["units"] as const,
  list: (params?: GetUnitsParams) => ["units", "list", params] as const,
  details: (id?: string) => ["units", "details", id] as const,
};

export function useUnits(params?: GetUnitsParams) {
  return useQuery({
    queryKey: unitsKeys.list(params),
    queryFn: () => getUnits(params),
  });
}

export function useUnitDetails(id?: string, lang?: string) {
  return useQuery({
    queryKey: unitsKeys.details(id),
    queryFn: () => (id ? getUnitById(id, lang) : Promise.reject("No ID")),
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: UnitInput; lang?: string }) =>
      createUnit(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, lang }: { id: string; input: UnitInput; lang?: string }) =>
      updateUnit(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) => deleteUnit(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.all }),
  });
}
