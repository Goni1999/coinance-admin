import VerifyEmail from "@/components/auth/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email Verification",
    description: "This is  Email Verification Page ",
  };

export default function EmailVerification() {
  return <VerifyEmail />;
}
