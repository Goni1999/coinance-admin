import EmailVerify from "@/components/auth/EmailVerify";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EmailVerify",
    description: "This is  EmailVerify Page ",
  };

export default function TwoStepVerification1() {
  return <EmailVerify />;
}
