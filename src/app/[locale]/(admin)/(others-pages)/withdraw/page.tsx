import CryptoWithdraw from "@/components/withdraw/WithdrawCoins";
import WithdrawTr from "@/components/withdraw/WithdrawelTransactions";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import FAQW from "@/components/withdraw/FaqsW";
export const metadata: Metadata = {
  title: "Withdraw",
  description:
    "",
  // other metadata
};
export default function page() {
  return (
    <div>
                    <PageBreadcrumb pageTitle="Withdraw " />
                  
                    <div className="grid grid-cols-12  md:gap-6">
      <div className="lg:p-6 col-span-12 space-y-6 xl:col-span-7">
        <CryptoWithdraw />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <FAQW />
      </div>

      <div className="col-span-12">
        <WithdrawTr />
        
      </div>

     
    </div>

</div>

  );
}
