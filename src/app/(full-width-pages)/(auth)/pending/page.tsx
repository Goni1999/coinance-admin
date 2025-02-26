import Pending from "@/components/auth/Pending";
import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
export const metadata: Metadata = {
    title: "Pending Request",
    description: "This is  Pending Page ",
  };
  

export default function ResetPassword() {
  return (
  <ProtectedRoute requiredRole="pending">

  <Pending />;
  </ProtectedRoute>
  );                    

}
