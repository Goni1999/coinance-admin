import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  user: { role: string } | null;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles }) => {
  if (!user) {
    // Redirect to Sign-in if not authenticated
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect if user role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
