import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const roleLoginRoute = {
  STUDENT: "/student/Studentlogin",
  ADMIN: "/Collegeadmin/CollegeAdminlogin",
  SUPERADMIN: "/superadmin/login",
};

const getRedirectPath = (roles = []) => {
  for (const role of roles) {
    if (roleLoginRoute[role]) {
      return roleLoginRoute[role];
    }
  }

  return "/";
};

const ProtectedRoute = ({ element, roles = [], fallback = "/" }) => {
  const { isReady, isAuthenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectTarget = getRedirectPath(roles);

    return (
      <Navigate to={redirectTarget} state={{ from: location }} replace />
    );
  }

  if (!hasAnyRole(roles)) {
    return <Navigate to={fallback} replace />;
  }

  return element;
};

export default ProtectedRoute;
