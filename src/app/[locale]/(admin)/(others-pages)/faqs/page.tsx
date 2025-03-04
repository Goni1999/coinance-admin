import FAQPage from "@/components/faqs/Faqs";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Faqs",
  description:
    "Faqs ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <FAQPage />
    </div>
  );
}
