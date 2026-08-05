import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllRoles,
  getRoleById,
  createRole,
  editRole,
  deleteRole,
} from "./roles.api";
import type { CreateRoleDto, EditRoleDto } from "./roles.types";

export const rolesKeys = {
  all: ["roles"] as const,
  list: (lang?: string) => [...rolesKeys.all, "list", lang] as const,
  detail: (id: string, lang?: string) => [...rolesKeys.all, "detail", id, lang] as const,
};

export function useRoles(lang?: string) {
  return useQuery({
    queryKey: rolesKeys.list(lang),
    queryFn: () => getAllRoles(lang),
  });
}

export function useRoleDetail(id: string, lang?: string) {
  return useQuery({
    queryKey: rolesKeys.detail(id, lang),
    queryFn: () => getRoleById(id, lang),
    enabled: Boolean(id),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, lang }: { data: CreateRoleDto; lang?: string }) =>
      createRole(data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

export function useEditRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      lang,
    }: {
      id: string;
      data: EditRoleDto;
      lang?: string;
    }) => editRole(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteRole(id, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
  });
}
