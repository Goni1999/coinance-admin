"use client";
import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import CoinDropdown from "../ecommerce/coinDropdows";

// Dummy balance data for example purposes
const dummyBalance = {
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
    
};


export const FundingUser = () => {
  const [selectedCoin, setSelectedCoin] = useState<keyof typeof dummyBalance>("bitcoin");

  // Handle coin selection change
  const handleCoinChange = (coin: keyof typeof dummyBalance) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-3xl text-gray-500 dark:text-gray-400">
              Funding
              <br />
            </span>
            <br />
            <h6 className=" text-gray-500 dark:text-gray-400">Total Balance</h6>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              0.00 <p className="text-sm text-gray-500 dark:text-gray-400">
                <CoinDropdown
                  selectedCoin={selectedCoin}
                  onCoinChange={handleCoinChange}
                  balance={dummyBalance}
                />
                ≈ -- USDT
              </p>
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            0.00
          </Badge>
        </div>
        <br />
        <hr />
        <div className="flex mt-16" style={{ flexDirection: 'column', alignItems: 'center', gap: 'var(--space-xl)' }}>
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M64 8H26V88H84V28L64 8ZM36 37H74V41H36V37ZM36 46H74V50H36V46ZM74 55H36V59H74V55Z"
              fill="url(#paint0_linear_2461_390787)"
            ></path>
            <path d="M62 71L66 67L70 71L66 75L62 71Z" fill="#1E2026"></path>
            <path d="M86 50L89 47L92 50L89 53L86 50Z" fill="#474D57"></path>
            <path d="M47 21L50 18L53 21L50 24L47 21Z" fill="#474D57"></path>
            <path d="M84 28H64V8L84 28Z" fill="#474D57"></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.17151 73.1717L18.6716 58.6718L24.3284 64.3287L9.82834 78.8286L4.17151 73.1717Z"
              fill="url(#paint1_linear_2461_390787)"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M51 48C51 39.1634 43.8366 32 35 32C26.1634 32 19 39.1634 19 48C19 56.8366 26.1634 64 35 64C43.8366 64 51 56.8366 51 48ZM55 48C55 36.9543 46.0457 28 35 28C23.9543 28 15 36.9543 15 48C15 59.0457 23.9543 68 35 68C46.0457 68 55 59.0457 55 48Z"
              fill="url(#paint2_linear_2461_390787)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_2461_390787"
                x1="84"
                y1="10.1622"
                x2="84"
                y2="88"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2B2F36"></stop>
                <stop offset="1" stopColor="#474D57"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_2461_390787"
                x1="4.17151"
                y1="68.7502"
                x2="24.3284"
                y2="68.7502"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#929AA5"></stop>
                <stop offset="1" stopColor="#76808F"></stop>
              </linearGradient>
              <linearGradient
                id="paint2_linear_2461_390787"
                x1="15"
                y1="48"
                x2="55"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#929AA5"></stop>
                <stop offset="1" stopColor="#76808F"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-6 text-gray-500 dark:text-gray-400">There are no documents generated for you at this time.</div>
        </div>
      </div>
    </div>
  );
};
