"use client"; // Mark as a client component

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useTranslations } from "next-intl";
// TypeScript interfaces
interface Balance {
  [key: string]: number; // Coin balances from API
}

interface Coin {
  id: string;
  name: string;
  current_price: number;
  image: string;
}

interface CoinData {
  id: string;
  name: string;
  amount: number;
  price: number;
  totalValue: number;
  image: string;
  status: "Frozen";
}

// Coin IDs based on CoinGecko's API
const coinIds: { [key: string]: string } = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  xrp: "ripple", // XRP ID on CoinGecko is "ripple"
  tether: "tether",
  bnb: "binancecoin", // BNB ID on CoinGecko is "binancecoin"
  solana: "solana",
  usdc: "usd-coin",
  dogecoin: "dogecoin",
  cardano: "cardano",
  staked_ether: "staked-ether",
};

export default function StatisticsChart() {
  const [, setBalances] = useState<Balance>({});
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const t = useTranslations();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (!token) throw new Error("No token found. Please log in.");

        // Fetch user balance from the database API
        const balanceResponse = await fetch("https://server.coinance.co/api/balance-admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!balanceResponse.ok) throw new Error("Failed to fetch balances");
        const balanceData: Balance = await balanceResponse.json();
        setBalances(balanceData);

        // Fetch live prices from CoinGecko using the correct coin IDs
        const coinGeckoResponse = await axios.get("https://pro-api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            ids: Object.values(coinIds).join(","),
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
          },
          headers: {
            "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
          }
        });

        const coinPriceData: Coin[] = coinGeckoResponse.data;

        // Map API balance data to live prices
        const combinedData: CoinData[] = Object.keys(balanceData).map((coinKey) => {
          const coinId = coinIds[coinKey]; // Get the correct CoinGecko ID from the mapping
          const coinInfo = coinPriceData.find((c) => c.id === coinId); // Find coin info by ID
          return {
            id: coinKey,
            name: coinInfo?.name || coinKey.toUpperCase(),
            amount: parseFloat(balanceData[coinKey] as unknown as string) || 0,
            price: coinInfo?.current_price || 0,
            totalValue: (parseFloat(balanceData[coinKey] as unknown as string) || 0) * (coinInfo?.current_price || 0),
            image: coinInfo?.image || "",
            status: "Frozen",
          };
        });

        setCoinData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  // Filter function
  const filteredCoins = filterApplied ? coinData.filter((coin) => coin.totalValue > 1) : coinData;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("overview1")}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterApplied((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            {filterApplied ? "Show All" : "Filter"}
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              {t("overview2")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              {t("overview3")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              {t("overview4")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              {t("overview5")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCoins.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img src={coin.image} alt={`${coin.name} logo`} className="w-12 h-12 p-2 rounded-full" />
                    </div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{coin.name}</p>
                  </div>
                </TableCell>
                <TableCell className="flex flex-col py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span>{coin.amount}</span>
                  <span className="text-gray-700 dark:text-gray-300">${coin.totalValue.toFixed(2)}</span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  ${coin.price.toFixed(2)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color="primary">{coin.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
