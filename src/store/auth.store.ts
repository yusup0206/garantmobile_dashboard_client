import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/services/auth/auth.types";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Effective permissions from GET /auth/me; empty until loaded / in demo. */
  permissions: string[];
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
      setSession: (user, token) => set({ user, token, isAuthenticated: true }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, permissions: [] }),
    }),
    { name: "gm.auth" },
  ),
);
