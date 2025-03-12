import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import ReportsHistory from "@/components/reports/ReportsList";
export const metadata: Metadata = {
  title: "Reports",
  description:
    "Reports ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />
      <ReportsHistory />
    </div>
  );
}
