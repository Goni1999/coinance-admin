
import KYCConfirmation from "@/components/auth/KYCConfirmation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "KYC Confirmation",
    description: "This is  KYC Confirmation Page ",
  };
  

export default function KYCConfirmation1() {
  return <KYCConfirmation />;
}
