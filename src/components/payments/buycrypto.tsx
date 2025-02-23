"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../../icons/index";
import CoinDropdown from "../ecommerce/coinDropdows";
export const BuyCrypto = () => {
  return (
    <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       {/*  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
         <!-- Metric Item Start --><GroupIcon className="text-gray-800 size-6 dark:text-white/90" />  
        </div>*/}

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-3xl text-gray-500 dark:text-gray-400">
            Buy Crypto
            </span>
            
         

        <div className="flex items-end justify-between mt-5" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <h6 className=" text-gray-500 dark:text-gray-400">Manage the payment method of your credit and debit card on the buy crypto page

        </h6>
        
        </div>
        </div>
          
          </div>
      {/* <!-- Metric Item End --> */}
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
          <div className="mt-6 text-gray-500 dark:text-gray-400">There are no payment method to manage.</div>
        </div>
        </div>
      {/* <!-- Metric Item Start --> 
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       {/*  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
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
          <button className="inline-flex items-center lg:px-20 gap-2 mt-4 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Withdraw
          </button>
        </div>

       <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
       <!-- Metric Item End --> */}
    </div>
  );
};
