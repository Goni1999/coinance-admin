import Invoices from "@/components/invoice/Invoices";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Invoices",
  description:
    "Invoices ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoices" />
      <Invoices />
    </div>
  );
}
