import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";  // Import AuthContext
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./(admin)/page";
import SignIn from "./(full-width-pages)/(auth)/signin/page";
import SignUp from "./(full-width-pages)/(auth)/signup/page";
import ResetPassword from "./(full-width-pages)/(auth)/reset-password/page";
import TwoStepVerification1 from "./(full-width-pages)/(auth)/twostepverification/page";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🚀 Redirect Home `/` to SignIn if not signed in */}
      <Route path="/" element={user ? <AdminDashboard /> : <SignIn />} />

      {/* Protected Admin Route - Only Admins Allowed */}
      <Route element={<ProtectedRoute user={user} allowedRoles={["admin"]} />}>
        <Route path="/dashboard/*" element={<AdminDashboard />} />
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
    <AuthProvider>  {/* Wrap everything with AuthProvider */}
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
