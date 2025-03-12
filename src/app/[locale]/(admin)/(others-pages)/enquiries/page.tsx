import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import EnquiriesHistory from "@/components/enquiries/EnquiriesList";
export const metadata: Metadata = {
  title: "Enquiries",
  description:
    "Enquiries ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Enquiries" />
      <EnquiriesHistory />
    </div>
  );
}
