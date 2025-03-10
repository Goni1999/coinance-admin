"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import CoinDropdown from "../ecommerce/coinDropdows";
import Link from "next/link";
import { useTranslations } from "next-intl";
// Corrected coin IDs
const coinIds: { [key: string]: string } = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  xrp: "ripple",
  tether: "tether",
  bnb: "binancecoin",
  solana: "solana",
  usdc: "usd-coin",
  dogecoin: "dogecoin",
  cardano: "cardano",
  staked_ether: "staked-ether"
};

// Function to fetch live coin price from CoinGecko
const getLiveCoinPrice = async (coin: string) => {
  try {
    const correctCoinId = coinIds[coin]; // Use the correct coin ID for the selected coin
    const response = await fetch(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${correctCoinId}&vs_currencies=usd`, {
      method: "GET",
      headers: {
        "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
      }
    });    const data = await response.json();

    // If price data is missing, return 0
    if (!data[correctCoinId] || !data[correctCoinId].usd) {
      console.warn(`No price found for ${coin}`);
      return 0;
    }

    return data[correctCoinId]?.usd || 0; // Return USD price if available
  } catch (error) {
    console.error("Error fetching coin price:", error);
    return 0; // Return 0 if there's an error
  }
};

// Type definition for balance state
type Balance = {
  bitcoin: number;
  ethereum: number;
  xrp: number;
  tether: number;
  bnb: number;
  solana: number;
  usdc: number;
  dogecoin: number;
  cardano: number;
  staked_ether: number;
};

export const EcommerceMetrics = () => {
  const t = useTranslations();
  const [balance, setBalance] = useState<Balance>({
    bitcoin: 0,
    ethereum: 0,
    xrp: 0,
    tether: 0,
    bnb: 0,
    solana: 0,
    usdc: 0,
    dogecoin: 0,
    cardano: 0,
    staked_ether: 0,
  });

  const [selectedCoin, setSelectedCoin] = useState<keyof Balance>("bitcoin");
  const [totalValue, setTotalValue] = useState<number>(0);

  // Fetch user's balance based on the auth token stored in sessionStorage
  const fetchUserBalance = async () => {
    const token = sessionStorage.getItem("auth-token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("https://server.capital-trust.eu/api/balance-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch balances");

      const balanceData: Balance = await response.json();
      setBalance(balanceData); // Update balance state with fetched data
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  // Fetch the live price and update the total value whenever the selected coin or balance changes
  useEffect(() => {
    const fetchPriceAndValue = async () => {
      const price = await getLiveCoinPrice(selectedCoin);
      const coinBalance = balance[selectedCoin] || 0;
      setTotalValue(price * coinBalance); // Update total value in USD
    };

    fetchPriceAndValue();
  }, [selectedCoin, balance]);

  // Fetch the user's balance when the component mounts
  useEffect(() => {
    fetchUserBalance();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t("ecomecom1")}</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {balance[selectedCoin] || 0}{" "}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <CoinDropdown selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} balance={balance} />
              </p>
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            ${totalValue > 0 ? totalValue.toFixed(2) : "Unavailable"} {/* Show the total value or "Unavailable" */}
          </Badge>
        </div>
      </div>
    

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       {/*  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>*/}
        <div className="flex items-end justify-between mt-5">
        <div className="flex items-center gap-3">
        <Link href="/managewallet-deposit">

          <button className="inline-flex items-center mt-4 gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <svg width="22" height="22" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.24000000000000005"/>

<g id="SVGRepo_iconCarrier"> <path d="M13 14.0008L7 14M13 14.0008L10.5 11.5M13 14.0008L10.5 16.5M21 12V11.2C21 10.0799 21 9.51984 20.782 9.09202C20.5903 8.71569 20.2843 8.40973 19.908 8.21799C19.4802 8 18.9201 8 17.8 8H3M21 12V16M21 12H19C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16H21M21 16V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8V8M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V8" stroke="#E4E7EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>

</svg>
           {t("ecomecom2")} 
          </button>
          </Link>

          <Link href="/withdraw">

          <button className="inline-flex items-center gap-2 mt-4 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          {t("ecomecom3")} 
          </button>
          </Link>
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
