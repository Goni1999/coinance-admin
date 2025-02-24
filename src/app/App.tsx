import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./(admin)/page";
import SignIn from "./(full-width-pages)/(auth)/signin/page";
import SignUp from "./(full-width-pages)/(auth)/signup/page";
import ResetPassword from "./(full-width-pages)/(auth)/reset-password/page";
import TwoStepVerification1 from "./(full-width-pages)/(auth)/twostepverification/page";

// Mock authentication state (replace with API call or context)
const currentUser = {
  role: "user", // Change to "admin" to test admin access
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Route - Only Admins Allowed */}
        <Route element={<ProtectedRoute user={currentUser} allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected Route for 2FA (Users and Admins Allowed) */}
        <Route element={<ProtectedRoute user={currentUser} allowedRoles={["admin"]} />}>
          <Route path="/twostepverification" element={<TwoStepVerification1 />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
