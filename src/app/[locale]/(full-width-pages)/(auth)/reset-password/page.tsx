import ForgotPassword from "@/components/auth/ResetPasswordForm"; 
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "This is  Reset Password Page ",
  };
  

export default function ResetPassword() {
  return <ForgotPassword />;
}
