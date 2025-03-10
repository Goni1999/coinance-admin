
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/users/UserTable";
export const metadata: Metadata = {
  title: "Users",
  description:
    "Users",
};

export default function Overview() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Users" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       
          <UserTable />
      </div>
    </div>
  );
}
