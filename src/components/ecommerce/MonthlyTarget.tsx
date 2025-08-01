"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { useTranslations } from "next-intl";
// Dynamically import ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define the structure of the API response
interface ProfitData {
  unpaid_amount: string;  // Unpaid amount as a string
  usdt_total: string;     // USDT total as a string
  [coin: string]: string; // Coin balances as strings
}

// Coin IDs to match with CoinGecko
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

export default function MonthlyTarget() {
  const t = useTranslations();
  const [data, setData] = useState<ProfitData | null>(null); // Allow null for initial state
  const [prices, setPrices] = useState<{ [key: string]: { usd: number } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalanceAndPrices() {
      try {
        // Fetch user balance from the API
        const balanceResponse = await fetch("https://server.coinance.co/api/profit-admin", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`, // Token from sessionStorage
          },
        });

        if (!balanceResponse.ok) {
          throw new Error("Failed to fetch balance data");
        }

        const balanceData: ProfitData = await balanceResponse.json();
        setData(balanceData);

        // Fetch live prices from CoinGecko API
        const coins = Object.keys(balanceData).filter(
          (coin) => coin !== "unpaid_amount" && coin !== "usdt_total"
        );

        // Map coins to their CoinGecko IDs
        const coinGeckoIds = coins
          .map((coin) => coinIds[coin.toLowerCase()])
          .filter((id) => id); // Ensure we have valid CoinGecko IDs

        const priceResponse = await fetch(
          `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds.join(",")}&vs_currencies=usd`,
        
          {
            method: "GET",
            headers: {
              "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
            }
          }
        );

        if (!priceResponse.ok) {
          throw new Error("Failed to fetch live prices");
        }

        const priceData = await priceResponse.json();
        setPrices(priceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBalanceAndPrices();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">{t("ecommontar1")}</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{t("ecommontar2")} {error}</div>;
  }

  if (!data) {
    return <div className="text-center text-red-500">{t("ecommontar3")}</div>;
  }

  const { unpaid_amount, usdt_total, ...coins } = data;

  // Convert unpaid_amount and usdt_total to numbers
  const unpaidAmount = parseFloat(unpaid_amount);
  const usdtTotal = parseFloat(usdt_total);

  // Convert coin balances to numbers (from strings)
  const coinBalances = Object.fromEntries(
    Object.entries(coins).map(([coin, balance]) => {
      const balanceNum = parseFloat(balance);
      return [coin, balanceNum];
    })
  );


  // Calculate total USDT equivalent based on live prices
  const totalCoinUSDT = Object.entries(coinBalances).reduce((total, [coin, amount]) => {
    const price = prices[coinIds[coin.toLowerCase()]]?.usd || 0;  // Map the coin to its CoinGecko ID
    const coinValue = amount * price;
    return total + coinValue;
  }, 0);


  // Total balance includes USDT total, unpaid amount, and total coin USDT value
  const totalBalance = totalCoinUSDT + usdtTotal;


  // Calculate the percentage increase based on unpaid amount
  const percentageIncrease = unpaidAmount
    ? ((totalBalance / unpaidAmount) * 100).toFixed(2)
    : "0.00";
    const timesX = (parseFloat(percentageIncrease) / 100).toFixed(2);


  const series = [parseFloat(percentageIncrease)];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("ecommontar4")} 
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
            {t("ecommontar5")} 
            </p>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            x{timesX} {t("ecommontar6")} 
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
        {t("ecommontar7")} 
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div className="flex justify-around w-full">
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("ecommontar8")} 
            </p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              ${unpaidAmount.toFixed(2).toLocaleString()}
            </p>
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("ecommontar9")}  
            </p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              ${usdtTotal.toFixed(2).toLocaleString()}
            </p>
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("ecommontar10")} 
            </p>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              ${totalBalance.toFixed(2).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
