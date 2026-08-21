import { Outlet } from "react-router-dom";

/**
 * Route container. Does not block client-side route entry;
 * unauthorized access is handled globally when APIs return 401 Unauthorized.
 */
export function ProtectedRoute() {
  return <Outlet />;
}
