import SecurityCheckup from "@/components/security/SecurityCheckup";
import TwoFactor from "@/components/security/TwoFactor";
import AdvancedSecurity from "@/components/security/AdvancedSecurity";
import AccountManagement from "@/components/security/AccountManagement";
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Securityr",
  description:
    "Securityr",
};

export default function Security() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Security " />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        
        </h3>
        <div className="space-y-6">
          <SecurityCheckup />
          <TwoFactor />
          <AdvancedSecurity/>
        <AccountManagement/>
        </div>
      </div>
    </div>
  );
}
