import { P2P } from "@/components/payments/p2p";
import { BuyCrypto } from "@/components/payments/buycrypto";
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Next.js Account Statement  |  - Next.js Dashboard Template",
  description:
    "This is Next.js Account Statement page for  - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Payments() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Payment" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        
        </h3>
        <div className="space-y-6">
          <P2P />
          <hr/>
          <BuyCrypto />
          

        </div>
      </div>
    </div>
  );
}
