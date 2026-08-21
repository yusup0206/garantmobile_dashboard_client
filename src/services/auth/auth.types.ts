export type AdminPermission = {
  permission: string;
  access: "readonly" | "write" | "full" | string;
};

export type AdminRole = {
  id: string;
  name: string;
  created?: string;
  permissions: AdminPermission[];
};

export type AuthUser = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
  initials: string;
  status?: string;
  roles?: AdminRole[];
};

export type LoginPayload = {
  /** Phone-based login for admin endpoint */
  phone?: string;
  /** Legacy username/email-based login */
  login?: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

/** GET /auth/me — the signed-in staff member's identity and permissions. */
export type Me = {
  id: number | string;
  name: string;
  phone?: string;
  role: string;
  permissions: string[];
  roles?: AdminRole[];
};
