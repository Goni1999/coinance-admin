import ResetPassword from "@/components/auth/ResetPassword";
import { Metadata } from "next";

// Metadata for the page
export const metadata: Metadata = {
  title: "Reset Password",
  description: "This is the Reset Password page.",
};

export default function ResetPassword1() {
  return (
    <ResetPassword />  // The ResetPassword component will handle everything
  );
}
