
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionsHistory from "@/components/usertransactions/UserTransactions";
export const metadata: Metadata = {
  title: "All transactions",
  description:
    "All transactions",
};

export default function Overview() {
  return (
    <div>
    <PageBreadcrumb pageTitle="All transactions" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       
          <TransactionsHistory />
      </div>
    </div>
  );
}
