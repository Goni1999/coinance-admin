
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Steps from "@/components/deposit/Steps";
import CopyAddress from "@/components/deposit/CopyAddress";
export const metadata: Metadata = {
  title: "Deposit",
  description:
    "Deposit",
};

export default function Overview() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Deposit" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        
        <div className="space-y-6">
          <CopyAddress /> 
          <br/>
          <Steps />
        </div>
      </div>
    </div>
  );
}
