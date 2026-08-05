import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { DEMO_USER } from "@/data/auth.mock";
import type { AuthUser, LoginPayload, LoginResponse, Me } from "./auth.types";

/** Shape of the backend POST /auth/login response (staff). */
type BackendLogin = {
  user: { id: number; name: string; role: string; initials: string };
  tokens: { accessToken: string };
};

/**
 * Staff login. Against the real backend (VITE_API_BASE_URL set) it posts to
 * /auth/login and returns the access token; otherwise it accepts any non-empty
 * credentials from the mock. Thrown errors carry i18n key CODES, resolved via
 * t() in the UI.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (isApiEnabled()) {
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

  return mockDelay(
    {
      token: "demo-token-" + Date.now(),
      user: DEMO_USER,
    },
    700,
  ).then((res) => {
    if (!payload.login || !payload.password) {
      throw new Error("login.err.badCredentials");
    }
    return res;
  });
}

/**
 * Issue a password-setup invite for a staff member created without a password
 * (backend gates this to `staff:write`, i.e. admin). Returns a short-lived token
 * the caller turns into an invite link.
 */
export type SetPasswordLink = {
  token: string;
  expiresIn: number;
  /** True when the backend also e-mailed the link to the member. */
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
 * Admin-initiated reset of another staff member's password (backend gates this
 * to `staff:write`). Locks the account and returns a fresh set-password token —
 * the same accept-invite link the member uses to choose a new password.
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
 * Consume an invite token: set the first password and sign in. Public — the
 * invitee is not yet authenticated. Errors carry the i18n key CODE resolved in
 * the UI.
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

/**
 * Change the signed-in staff member's own password. On success the backend
 * rotates every session and returns a fresh token pair; the caller should adopt
 * the new token. Errors carry the i18n key CODE resolved in the UI.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<LoginResponse> {
  if (isApiEnabled()) {
    try {
      const res = await apiClient<BackendLogin>("/auth/change-password", {
        method: "POST",
        token: authToken(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const user: AuthUser = {
        id: String(res.user.id),
        name: res.user.name,
        role: res.user.role,
        initials: res.user.initials,
      };
      return { token: res.tokens.accessToken, user };
    } catch {
      throw new Error("password.err.invalid");
    }
  }
  return mockDelay({ token: "demo-token-" + Date.now(), user: DEMO_USER }, 500);
}

/**
 * Current staff identity and effective permissions. In demo mode there is no
 * backend, so it returns an empty permission list — the UI treats that as
 * "unrestricted" (the real backend enforces permissions server-side anyway).
 */
export async function getMe(): Promise<Me> {
  if (isApiEnabled()) {
    return apiClient<Me>("/auth/me", { token: authToken() });
  }
  return mockDelay({
    id: 0,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
    permissions: [],
  });
}
