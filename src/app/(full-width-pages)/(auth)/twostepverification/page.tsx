import TwoStepVerification from "@/components/auth/TwoStepVerification";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Two Step Authentication",
    description: "This is  Two Step Authentication Page ",
  };

export default function TFA() {
  return <TwoStepVerification />;
}
