import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InvestmentsHistory from "@/components/investments/InvestmentList";
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
      <InvestmentsHistory />
    </div>
  );
}
