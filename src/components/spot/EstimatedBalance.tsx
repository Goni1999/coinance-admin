"use client"; // Mark the component as a client component

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"; // Your custom Table components
import Badge from "../ui/badge/Badge";
import Image from "next/image";  // Ensure you're using Next.js's Image component for optimized image loading
import Button from "../ui/button/Button";

// Define the TypeScript interface for the table rows
interface Coin {
  id: string;
  name: string;
  amount: number; // Amount of coins from DB or a static value
  price: number; // Live price of the coin
  status: "Frozen"; // Status will be frozen for all coins
  image: string;
}

export default function StatisticsChart() {
  const [coins, setCoins] = useState<Coin[]>([]); // State to hold coin data
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]); // State for filtered coins
  const [filterApplied, setFilterApplied] = useState(false); // State to toggle filter

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        // Fetching coin data from CoinGecko API
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 4,
            page: 1,
          },
        });

        // Process the fetched coin data and add some static values like the amount
        const coinsWithAmounts = response.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          amount: Math.floor(Math.random() * 1000), // Random amount for demo, replace with actual DB value
          price: coin.current_price, // Live price of the coin
          image: coin.image,
          status: "Frozen", // All coins have "Frozen" status
        }));

        setCoins(coinsWithAmounts);
        // Initially apply the filter if filter is already set
        if (filterApplied) {
          const filtered = coinsWithAmounts.filter((coin: Coin) => coin.amount * coin.price > 1);
          setFilteredCoins(filtered);
        } else {
          setFilteredCoins(coinsWithAmounts); // Set all coins if no filter is applied
        }
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    fetchCoinsData();
  }, [filterApplied]); // Re-run the effect when filterApplied changes

  // Handle filter button click
  const handleFilterClick = () => {
    setFilterApplied((prev) => !prev);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Spot Assets
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFilterClick} // Toggle filter on click
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Hide assets &lt; 1 USD
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Coin
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Available
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium   text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCoins.map((coin: Coin) => {
              const totalValue = coin.amount * coin.price;
              return (
                <TableRow key={coin.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <img
                          src={coin.image}
                          alt={`${coin.name} logo`}
                          className="w-12 h-12 p-2 rounded-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {coin.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="flex flex-col py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span>{coin.amount}</span>
                    <span>${totalValue.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    0.00 {/*{coin.price.toFixed(2)}*/}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color="primary">
                      {coin.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <a href="https://21bitcoin.app/en/download"
                    target="_blank"
                    rel="nofollow"
                    className="flex items-center justify-center p-1 font-medium text-white rounded-lg bg-brand-400 text-theme-sm hover:bg-brand-600 pointer-events-none cursor-not-allowed">
                      Earn
                  </a>

                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
