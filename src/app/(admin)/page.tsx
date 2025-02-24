import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import TransactionsHistory from "@/components/transactions/TransactionsHistory";
import Watchlist from "@/components/trade/Watchlist";
export const metadata: Metadata = {
  title:
    "Capital Trust Dashboard",
  description: "Capital Trust Dashboard",
};

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <Watchlist/>
        <br/>
      
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <TransactionsHistory />
      </div>
    </div>
  );
}

