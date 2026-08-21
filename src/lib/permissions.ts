import { isApiEnabled } from "@/config/env";
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
