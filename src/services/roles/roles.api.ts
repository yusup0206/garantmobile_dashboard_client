import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { MOCK_ROLES } from "@/data/roles.mock";
import type {
  RoleResponse,
  CreateRoleDto,
  EditRoleDto,
  DeleteRoleResponse,
  GetRolesParams,
} from "./roles.types";

export function getAllRoles(params?: GetRolesParams): Promise<RoleResponse[]> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString();
    const endpoint = `/roles/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      if (Array.isArray(r)) return r as RoleResponse[];
      if (Array.isArray((r?.data as Record<string, unknown>)?.roles))
        return (r.data as Record<string, unknown>).roles as RoleResponse[];
      if (Array.isArray(r?.roles)) return r.roles as RoleResponse[];
      if (Array.isArray(r?.data)) return r.data as RoleResponse[];
      if (Array.isArray(r?.items)) return r.items as RoleResponse[];
      return [];
    });
  }

  let filtered = [...MOCK_ROLES];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  return mockDelay(filtered);
}

export function getRoleById(id: string, lang?: string): Promise<RoleResponse> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/roles/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as RoleResponse;
    });
  }
  const role = MOCK_ROLES.find((r) => r.id === id);
  if (!role) return Promise.reject(new Error("Role not found"));
  return mockDelay(role);
}

export function createRole(data: CreateRoleDto, lang?: string): Promise<RoleResponse> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/roles/create", {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as RoleResponse;
    });
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
    return apiClient<unknown>(`/roles/edit/${id}`, {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as RoleResponse;
    });
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
