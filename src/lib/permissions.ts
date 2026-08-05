import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isApiEnabled } from "@/config/env";
import { getMe } from "@/services/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

/**
 * Predicate for gating UI by capability. Permissive in demo mode and until the
 * permission list has loaded (an empty list means "not yet known"), so nothing
 * flashes hidden; the backend still enforces every permission server-side.
 */
export function useHasPermission(): (permission: string) => boolean {
  const permissions = useAuthStore((s) => s.permissions);
  return (permission: string) =>
    !isApiEnabled() || permissions.length === 0 || permissions.includes(permission);
}

/**
 * Keeps the store's permissions in sync with GET /auth/me while signed in.
 * Mounted once by the authenticated layout, so it covers both a fresh login and
 * a page refresh with a still-valid token.
 */
export function useSyncPermissions(): void {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setPermissions = useAuthStore((s) => s.setPermissions);

  const { data } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: isApiEnabled() && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setPermissions(data.permissions);
  }, [data, setPermissions]);
}
