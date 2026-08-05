import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  editAdmin,
  deleteAdmin,
} from "./users.api";
import type { GetAdminsParams, CreateAdminDto, EditAdminDto } from "./users.types";

export const usersKeys = {
  all: ["admins"] as const,
  list: (params?: GetAdminsParams) => [...usersKeys.all, "list", params] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};

export function useAdmins(params?: GetAdminsParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => getAllAdmins(params),
  });
}

export function useAdminDetail(id: string, lang?: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => getAdminById(id, lang),
    enabled: Boolean(id),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, lang }: { data: CreateAdminDto; lang?: string }) =>
      createAdmin(data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useEditAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      lang,
    }: {
      id: string;
      data: EditAdminDto;
      lang?: string;
    }) => editAdmin(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteAdmin(id, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

/** Backward compatibility hooks */
export const useUsers = useAdmins;
export const useCreateUser = useCreateAdmin;
export const useUpdateUser = useEditAdmin;
export const useDeleteUser = useDeleteAdmin;
export function useInviteStaff() {
  return useMutation({ mutationFn: async () => {} });
}
export function useResetStaff() {
  return useMutation({ mutationFn: async () => {} });
}
