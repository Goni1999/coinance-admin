import BestCoins from "@/components/trade/BestCoins";
import TradeForm from "@/components/trade/TradeForm";
import { Metadata } from "next";
import React from "react";
import TradingApp from "@/components/trade/TradingApp";
import Watchlist from "@/components/trade/Watchlist";
import TransactionsHistory from "@/components/transactions/TransactionsHistory";
export const metadata: Metadata = {
  title: "Next.js Trade  |  - Next.js Dashboard Template",
  description:
    "This is Next.js Trade page for  - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Spotorder() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
          

      <div className="col-span-12">
        <BestCoins />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TradingApp />

      </div>

      <div className="col-span-12 xl:col-span-5">
      <TradeForm />
      <Watchlist/>
      </div>

      <div className="col-span-12">
        <TransactionsHistory/>

      </div>

      
    </div>
  );
}
