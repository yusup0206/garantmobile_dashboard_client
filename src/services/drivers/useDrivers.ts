import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDriver, deleteDriver, getDrivers, updateDriver } from "./drivers.api";
import type { DriverInput } from "./drivers.types";

export const driversKeys = {
  all: ["drivers"] as const,
};

export function useDrivers() {
  return useQuery({ queryKey: driversKeys.all, queryFn: getDrivers });
}

export function useCreateDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DriverInput) => createDriver(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: driversKeys.all }),
  });
}

export function useUpdateDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: DriverInput }) =>
      updateDriver(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: driversKeys.all }),
  });
}

export function useDeleteDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDriver(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: driversKeys.all }),
  });
}
