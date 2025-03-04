import BestCoins from "@/components/trade/BestCoins";
import TradeForm from "@/components/trade/TradeForm";
import { Metadata } from "next";
import React from "react";
import TradingApp from "@/components/trade/TradingApp";
import Watchlist from "@/components/trade/Watchlist";
import SpotTransfers from "@/components/trade/SpotTransfers";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
export const metadata: Metadata = {
  title: "Spot Order",
  description:
    "Spot Order",
};

export default function Spotorder() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Spot Order " />

    <div className="grid grid-cols-12 gap-4 md:gap-6">
          

      <div className="col-span-12">
        <BestCoins />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TradingApp />

      </div>

      <div className="col-span-12 xl:col-span-5">
      <TradeForm />
      <br/>
      <Watchlist/>
      </div>

      <div className="col-span-12">
        <SpotTransfers/>

      </div>

      </div>

    </div>
  );
}
