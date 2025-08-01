import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InvestmentsHistory from "@/components/investments/InvestmentList";
export const metadata: Metadata = {
  title: "Investments",
  description:
    "Investments ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Investments" />
      <InvestmentsHistory />
    </div>
  );
}
