import UserVerification from "@/components/identification/UserVerification";
import PersonalInformation from "@/components/identification/PersonalInformation";
import AccountLimits from "@/components/identification/AccountLimits";
import VerificationLevels from "@/components/identification/VerificationLevels";
import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Identification",
  description:
    "Identification",
};

export default function Indetification() {
  return (
    <div>
            <PageBreadcrumb pageTitle="Identification" />

    <div className="grid grid-cols-12 gap-4 md:gap-6">
        
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <UserVerification />
            <AccountLimits />

            <PersonalInformation />

          </div>
    
          <div className="col-span-12 xl:col-span-5">
            {/*<MonthlyTarget />*/}
            <VerificationLevels/>
          </div>
    
          <div className="col-span-12">
          {/*  <StatisticsChart />*/}
          </div>
    
          </div>

        </div>
  );
}
