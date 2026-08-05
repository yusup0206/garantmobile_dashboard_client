import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

/** Shell for unauthenticated screens. If already logged in, skip to dashboard. */
export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
