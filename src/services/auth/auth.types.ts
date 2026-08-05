export type AuthUser = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export type LoginPayload = {
  login: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

/** GET /auth/me — the signed-in staff member's identity and permissions. */
export type Me = {
  id: number;
  name: string;
  role: string;
  permissions: string[];
};
