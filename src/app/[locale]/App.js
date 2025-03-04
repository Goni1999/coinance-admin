import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";  
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./[locale]/(admin)/page";
import SignIn from "./[locale]/(full-width-pages)/(auth)/signin/page";
import SignUp from "./[locale]/(full-width-pages)/(auth)/signup/page";
import ResetPassword from "./[locale]/(full-width-pages)/(auth)/reset-password/page";
import TwoStepVerification1 from "./[locale]/(full-width-pages)/(auth)/twostepverification/page";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🚀 Redirect Home `/` Based on Role */}
      <Route
        path="/"
        element={
          user ? (user.role === "admin" ? <AdminDashboard /> : <Navigate to="/signin" />) : <SignIn />
        }
      />

      {/* Protected Admin Route - Only Admins Allowed */}
      <Route element={<ProtectedRoute user={user} allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Protected Route for 2FA (Users and Admins Allowed) */}
      <Route element={<ProtectedRoute user={user} allowedRoles={["user", "admin"]} />}>
        <Route path="/2fa" element={<TwoStepVerification1 />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
