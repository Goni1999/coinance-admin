import { Suspense } from "react";  // Import Suspense to wrap the component
import ResetPassword from "@/components/auth/ResetPassword";  // Import ResetPassword

// Metadata for the page
export const metadata = {
  title: "Reset Password",
  description: "This is the Reset Password page.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>  {/* Suspense boundary for async work */}
      <ResetPassword />
    </Suspense>
  );
}
