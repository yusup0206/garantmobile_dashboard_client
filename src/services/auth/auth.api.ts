import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { DEMO_USER } from "@/data/auth.mock";
import type {
  AuthUser,
  AdminRole,
  LoginPayload,
  LoginResponse,
} from "./auth.types";

type ApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  data?: T;
  timestamp?: string;
};

/** Shape of POST /garant/admins/login response. */
type AdminLoginResponse = {
  admin: {
    id: string;
    phone: string;
    email?: string | null;
    name: string;
    status?: string;
    created?: string;
    roles: AdminRole[];
  };
  token: string;
};

/** Shape of legacy backend POST /auth/login response (staff). */
type BackendLogin = {
  user: { id: number; name: string; role: string; initials: string };
  tokens: { accessToken: string };
};

function initials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function primaryRole(roles: AdminRole[]): string {
  return roles[0]?.name ?? "admin";
}

/**
 * Admin login via POST /garant/admins/login.
 * Falls back to the legacy /auth/login if no phone is supplied.
 * In demo mode (no VITE_API_BASE_URL) accepts any non-empty credentials.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (isApiEnabled()) {
    // ── New admin endpoint (phone-based) ──
    if (payload.phone) {
      try {
        const res = await apiClient<ApiResponse<AdminLoginResponse> | AdminLoginResponse>("/admins/login", {
          method: "POST",
          headers: { "Accept-Language": "tk" },
          body: JSON.stringify({
            phone: payload.phone,
            password: payload.password,
          }),
        });

        const data =
          res && typeof res === "object" && "data" in res && res.data
            ? (res.data as AdminLoginResponse)
            : (res as AdminLoginResponse);

        if (!data?.admin || !data?.token) {
          throw new Error("login.err.badCredentials");
        }

        const user: AuthUser = {
          id: String(data.admin.id),
          name: data.admin.name || "Admin",
          phone: data.admin.phone ?? undefined,
          email: data.admin.email ?? undefined,
          status: data.admin.status,
          role: primaryRole(data.admin.roles ?? []),
          initials: initials(data.admin.name || "Admin"),
          roles: data.admin.roles ?? [],
        };
        return { token: data.token, user };
      } catch (err) {
        if (err instanceof Error && err.message !== "login.err.badCredentials") {
          console.error("Admin login error:", err);
        }
        throw new Error("login.err.badCredentials");
      }
    }

    // ── Legacy staff endpoint (login/email-based) ──
    try {
      const res = await apiClient<BackendLogin>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          login: payload.login,
          password: payload.password,
        }),
      });
      const user: AuthUser = {
        id: String(res.user.id),
        name: res.user.name,
        role: res.user.role,
        initials: res.user.initials,
      };
      return { token: res.tokens.accessToken, user };
    } catch {
      throw new Error("login.err.badCredentials");
    }
  }

  // ── Demo / mock mode ──
  return mockDelay(
    {
      token: "demo-token-" + Date.now(),
      user: DEMO_USER,
    },
    700,
  ).then((res) => {
    const identifier = payload.phone || payload.login;
    if (!identifier || !payload.password) {
      throw new Error("login.err.badCredentials");
    }
    return res;
  });
}

/**
 * Issue a password-setup invite for a staff member created without a password
 * (backend gates this to `staff:write`, i.e. admin).
 */
export type SetPasswordLink = {
  token: string;
  expiresIn: number;
  emailed?: boolean;
};

export async function inviteStaff(id: number): Promise<SetPasswordLink> {
  if (isApiEnabled()) {
    return apiClient<SetPasswordLink>(`/auth/staff/${id}/invite`, {
      method: "POST",
      token: authToken(),
    });
  }
  return mockDelay({ token: "demo-invite-token", expiresIn: 259200, emailed: false });
}

/**
 * Admin-initiated reset of another staff member's password.
 */
export async function resetStaffPassword(id: number): Promise<SetPasswordLink> {
  if (isApiEnabled()) {
    return apiClient<SetPasswordLink>(`/auth/staff/${id}/reset-password`, {
      method: "POST",
      token: authToken(),
    });
  }
  return mockDelay({ token: "demo-reset-token", expiresIn: 259200, emailed: false });
}

/**
 * Consume an invite token: set the first password and sign in.
 */
export async function acceptInvite(
  token: string,
  password: string,
): Promise<LoginResponse> {
  if (isApiEnabled()) {
    try {
      const res = await apiClient<BackendLogin>("/auth/staff/accept-invite", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      const user: AuthUser = {
        id: String(res.user.id),
        name: res.user.name,
        role: res.user.role,
        initials: res.user.initials,
      };
      return { token: res.tokens.accessToken, user };
    } catch {
      throw new Error("accept.err.invalid");
    }
  }
  return mockDelay({ token: "demo-token-" + Date.now(), user: DEMO_USER }, 500);
}
