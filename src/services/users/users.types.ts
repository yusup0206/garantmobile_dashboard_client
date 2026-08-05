import type { RoleResponse } from "@/services/roles/roles.types";

export type AdminStatus = "active" | "invited" | "blocked";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: AdminStatus;
  created?: string;
  roles?: RoleResponse[];
};

export type CreateAdminDto = {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  status: AdminStatus;
  roleIds: string[];
};

export type EditAdminDto = {
  name: string;
  email: string;
  phone?: string;
  status: AdminStatus;
  roleIds: string[];
};

export type GetAdminsParams = {
  page?: number;
  pageSize?: number;
  status?: AdminStatus;
  search?: string;
  lang?: string;
};

export type DeleteAdminResponse = {
  deleted: boolean;
};

/** Compatibility alias for legacy Staff references */
export type Staff = AdminUser;
export type StaffInput = CreateAdminDto;
