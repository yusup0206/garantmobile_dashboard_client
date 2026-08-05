import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { MOCK_ROLES } from "@/data/roles.mock";
import type {
  RoleResponse,
  CreateRoleDto,
  EditRoleDto,
  DeleteRoleResponse,
} from "./roles.types";

export function getAllRoles(lang?: string): Promise<RoleResponse[]> {
  if (isApiEnabled()) {
    return apiClient<any>("/roles/all", {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res) => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data?.roles)) return res.data.roles;
      if (Array.isArray(res?.roles)) return res.roles;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.items)) return res.items;
      return [];
    });
  }
  return mockDelay(MOCK_ROLES);
}

export function getRoleById(id: string, lang?: string): Promise<RoleResponse> {
  if (isApiEnabled()) {
    return apiClient<any>(`/roles/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res) => res?.data || res);
  }
  const role = MOCK_ROLES.find((r) => r.id === id);
  if (!role) return Promise.reject(new Error("Role not found"));
  return mockDelay(role);
}

export function createRole(data: CreateRoleDto, lang?: string): Promise<RoleResponse> {
  if (isApiEnabled()) {
    return apiClient<any>("/roles/create", {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res) => res?.data || res);
  }
  const newRole: RoleResponse = {
    ...data,
    id: "mock-role-" + Date.now(),
    created: new Date().toISOString(),
  };
  MOCK_ROLES.push(newRole);
  return mockDelay(newRole);
}

export function editRole(id: string, data: EditRoleDto, lang?: string): Promise<RoleResponse> {
  if (isApiEnabled()) {
    return apiClient<any>(`/roles/edit/${id}`, {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res) => res?.data || res);
  }
  const index = MOCK_ROLES.findIndex((r) => r.id === id);
  if (index !== -1) {
    MOCK_ROLES[index] = { ...MOCK_ROLES[index], ...data };
    return mockDelay(MOCK_ROLES[index]);
  }
  return Promise.reject(new Error("Role not found"));
}

export function deleteRole(id: string, lang?: string): Promise<DeleteRoleResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteRoleResponse>(`/roles/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    });
  }
  const index = MOCK_ROLES.findIndex((r) => r.id === id);
  if (index !== -1) {
    MOCK_ROLES.splice(index, 1);
  }
  return mockDelay({ deleted: true });
}
