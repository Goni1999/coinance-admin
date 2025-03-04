import UserInfoCard from "@/components/accstatement/InfoUser";
import { FundingUser } from "@/components/accstatement/FundingUser";
import { SpotUser } from "@/components/accstatement/SpotUser";
import { TotalValue } from "@/components/accstatement/TotalValue";
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "AccountStatement",
  description:
    "AccountStatement",
};

export default function AccountStatements() {
  return (
    <div>
    <PageBreadcrumb pageTitle="AccountStatement" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        </h3>
        <div className="space-y-6">
          <UserInfoCard />
          <TotalValue />
          <SpotUser />
          <FundingUser />

        </div>
      </div>
    </div>
  );
}
