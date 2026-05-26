import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../constants";

export default function ProtectedRoute({ allowedRoles, user }) {
  if (!user) return <Navigate to={PATHS.LOGIN} replace />;

  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) return <Navigate to={PATHS.HOME} replace />;

  // This renders the active child component layout block matching the current nested path URL
  return <Outlet />;
}
