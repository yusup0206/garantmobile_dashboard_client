import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, AdminRole } from "@/services/auth/auth.types";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Flattened permission strings from all roles (e.g. "orders:readonly"). */
  permissions: string[];
  /** Raw roles from the admin login response. */
  roles: AdminRole[];
  setSession: (user: AuthUser, token: string) => void;
  setPermissions: (permissions: string[]) => void;
  logout: () => void;
};

/**
 * Client-state only: who is logged in. Server data (orders, analytics) is NOT
 * stored here — it lives in React Query. Persisted so a refresh keeps the session.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
      roles: [],
      setSession: (user, token) => {
        // Flatten permissions from roles for easy lookup
        const flatPerms: string[] = [];
        for (const role of user.roles ?? []) {
          for (const perm of role.permissions ?? []) {
            flatPerms.push(`${perm.permission}:${perm.access}`);
          }
        }
        set({
          user,
          token,
          isAuthenticated: true,
          roles: user.roles ?? [],
          permissions: flatPerms,
        });
      },
      setPermissions: (permissions) => set({ permissions }),
      logout: () => {
        // Clear persisted auth from localStorage before resetting state
        localStorage.removeItem("gm.auth");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
          roles: [],
        });
        window.location.href = "/login";
      },
    }),
    { name: "gm.auth" },
  ),
);
