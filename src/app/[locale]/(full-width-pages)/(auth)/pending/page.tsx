import Pending from "@/components/auth/Pending";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Pending Request",
    description: "This is  Pending Page ",
  };
  

export default function Pending1() {
  return <Pending />;

}
