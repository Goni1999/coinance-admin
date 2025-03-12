
'use client';

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Invoices from "@/components/userinvoices/UserInvoices";
export default function Users() {
   const [loading, setLoading] = useState<boolean>(true);
    
      useEffect(() => {
        const timeoutId = setTimeout(() => {
          setLoading(false); // Hide spinner after delay
        }, 300); // Delay time (e.g., 1 second)
    
        return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
      }, []); // Empty dependency array to run the effect once on page load
    
      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        );
      }
  return (
    <div>
    <PageBreadcrumb pageTitle="Users" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       
          <Invoices />
      </div>
    </div>
  );
}
