import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./(admin)/page";
import SignIn from "./(full-width-pages)/(auth)/signin/page";
import SignUp from "./(full-width-pages)/(auth)/signup/page";
import ResetPassword from "./(full-width-pages)/(auth)/reset-password/page";
import TwoStepVerification1 from "./(full-width-pages)/(auth)/twostepverification/page";
const currentUser = {
  role: "admin", // Example role, fetch from API or Context
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/2fa" element={<TwoStepVerification1 />} />

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute user={currentUser} allowedRoles={["user"]} />}>
          <Route path="/dashboard/*" element={<AdminDashboard />} />
          <Route path="/2fa" element={<TwoStepVerification1 />} />

        </Route>

      </Routes>
    </Router>
  );
};

export default App;
