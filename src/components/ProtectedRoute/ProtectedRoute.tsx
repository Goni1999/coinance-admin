import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  user: { role: string } | null;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles }) => {
  if (!user) {
    // 🚀 If not signed in, redirect to Sign In page
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 🚨 If user role is not allowed, redirect to Unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
    