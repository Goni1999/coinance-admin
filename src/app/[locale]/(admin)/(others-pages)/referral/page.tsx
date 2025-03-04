import Referral from "@/components/referral/Referral";
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Tips from "@/components/referral/Tips";
export const metadata: Metadata = {
  title: "Referral",
  description:
    "Referral",
};

export default function Security() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Referral " />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        
        </h3>
        <div className="space-y-6">
          <Referral />
          <Tips/>
        </div>
      </div>
    </div>
  );
}
