import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type {
  AdminUser,
  CreateAdminDto,
  EditAdminDto,
  GetAdminsParams,
  DeleteAdminResponse,
} from "./users.types";

export function getAllAdmins(params?: GetAdminsParams): Promise<{ count: number; admins: AdminUser[] }> {
  if (isApiEnabled()) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString();
    const endpoint = `/admins/all${queryString ? `?${queryString}` : ""}`;

    return apiClient<unknown>(endpoint, {
      token: authToken(),
      headers: {
        "Accept-Language": params?.lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      if (r?.admins && Array.isArray(r.admins)) {
        return { count: (r.count as number) ?? (r.admins as AdminUser[]).length, admins: r.admins as AdminUser[] };
      }
      const dataObj = r?.data as Record<string, unknown>;
      if (dataObj?.admins && Array.isArray(dataObj.admins)) {
        return { count: (dataObj.count as number) ?? (dataObj.admins as AdminUser[]).length, admins: dataObj.admins as AdminUser[] };
      }
      if (Array.isArray(r)) {
        return { count: r.length, admins: r as AdminUser[] };
      }
      if (Array.isArray(r?.data)) {
        return { count: (r.data as AdminUser[]).length, admins: r.data as AdminUser[] };
      }
      return { count: 0, admins: [] };
    });
  }

  // Fallback mock
  return mockDelay({
    count: 2,
    admins: [
      {
        id: "clg1x0z5e0000v6l3f4b7j2k1",
        phone: "+99365990099",
        email: "admin@hello.com",
        name: "Amanow Aman",
        status: "active",
        created: new Date().toISOString(),
        roles: [{ id: "r1", name: "admin", created: "", permissions: [] }],
      },
      {
        id: "clg1x0z5e0000v6l3f4b7j2k2",
        phone: "+99361223344",
        email: "manager@hello.com",
        name: "Begench Gurbanov",
        status: "active",
        created: new Date().toISOString(),
        roles: [{ id: "r2", name: "manager", created: "", permissions: [] }],
      },
    ],
  });
}

export function getAdminById(id: string, lang?: string): Promise<AdminUser> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/admins/details/${id}`, {
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as AdminUser;
    });
  }
  return mockDelay({
    id,
    phone: "+99365990099",
    email: "admin@hello.com",
    name: "Amanow Aman",
    status: "active",
    created: new Date().toISOString(),
  });
}

export function createAdmin(data: CreateAdminDto, lang?: string): Promise<AdminUser> {
  if (isApiEnabled()) {
    return apiClient<unknown>("/admins/create", {
      method: "POST",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as AdminUser;
    });
  }
  return mockDelay({
    ...data,
    id: "mock-admin-" + Date.now(),
    created: new Date().toISOString(),
  });
}

export function editAdmin(id: string, data: EditAdminDto, lang?: string): Promise<AdminUser> {
  if (isApiEnabled()) {
    return apiClient<unknown>(`/admins/edit/${id}`, {
      method: "PUT",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
      body: JSON.stringify(data),
    }).then((res: unknown) => {
      const r = res as Record<string, unknown>;
      return (r?.data || r) as AdminUser;
    });
  }
  return mockDelay({
    ...data,
    id,
    created: new Date().toISOString(),
  });
}

export function deleteAdmin(id: string, lang?: string): Promise<DeleteAdminResponse> {
  if (isApiEnabled()) {
    return apiClient<DeleteAdminResponse>(`/admins/delete/${id}`, {
      method: "DELETE",
      token: authToken(),
      headers: {
        "Accept-Language": lang || "tk",
      },
    });
  }
  return mockDelay({ deleted: true });
}

/** Backward compatibility exports */
export const getUsers = getAllAdmins;
export const createUser = createAdmin;
export const updateUser = editAdmin;
export const deleteUser = deleteAdmin;
