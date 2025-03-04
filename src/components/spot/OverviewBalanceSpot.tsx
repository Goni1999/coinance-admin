"use client";
import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import CoinDropdown from "../ecommerce/coinDropdows";

// Fake balance data
const fakeBalance = {
  bitcoin: 0.00,
  ethereum: 0.00,
  xrp: 0.00,
  tether: 0.00,
  bnb: 0.00,
  solana: 0.00,
  usdc: 0.00,
  dogecoin: 0.00,
  cardano: 0.00,
  staked_ether: 0.00,
  
};

export const EstimatedBalance = () => {
  const [selectedCoin, setSelectedCoin] = useState<keyof typeof fakeBalance>("bitcoin");
  const [totalValue, setTotalValue] = useState<number>(0);

  // Calculate the total value in USD based on the selected coin
  // For now, we'll assume all coins are worth $0.00
  const calculateTotalValue = () => {
    const coinBalance = fakeBalance[selectedCoin] || 0;
    setTotalValue(coinBalance); // Since all are fake values, the total will just be 0.00
  };

  // Run the calculation when the selected coin changes
  React.useEffect(() => {
    calculateTotalValue();
  }, [selectedCoin]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Spot Balance</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {fakeBalance[selectedCoin]} {/* All values are set to 0.00 */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <CoinDropdown selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} balance={fakeBalance} />
              </p>
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            ${totalValue.toFixed(2)} {/* Total value will always be 0.00 */}
          </Badge>
        </div>
      </div>
     
  
 
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       {/*  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>*/}
        <div className="flex items-end justify-between mt-5">
        <div className="flex items-center  gap-3">
          <button className="inline-flex items-center lg:px-24 mt-4 gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <svg width="22" height="22" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.24000000000000005"/>

<g id="SVGRepo_iconCarrier"> <path d="M13 14.0008L7 14M13 14.0008L10.5 11.5M13 14.0008L10.5 16.5M21 12V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3M21 12V16M21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21M21 16V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8V8M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8" stroke="#E4E7EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>

</svg>
            Deposit
          </button>
          <div className="relative group ">

          <button className="inline-flex items-center lg:px-20 gap-2 mt-4 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-500 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 pointer-events-none cursor-not-allowed">
            Transfer
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm p-2 rounded">
                        This option is locked now
                      </div>
                    </div>
        </div>

         {/*  <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>*/}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
