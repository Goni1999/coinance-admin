import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  user: { role: string } | null;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles }) => {
  if (!user) {
    // If no user is logged in, redirect to sign-in
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user does not have required role, redirect to an unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
