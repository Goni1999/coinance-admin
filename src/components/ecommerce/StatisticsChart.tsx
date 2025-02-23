"use client"; // Mark the component as a client component

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Disable server-side rendering for this component
});

type Coin = {
  id: string;
  name: string;
  market_cap: number;
  current_price: number;
  total_volume: number;
  circulating_supply: number;
  price_change_percentage_1h?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  image: string;  // Add image field for the coin's logo
};


type PriceData = {
  x: number; // Timestamp (in milliseconds)
  y: number[]; // [open, high, low, close]
};

export default function StatisticsChart() {
  const [cryptoCoins, setCryptoCoins] = useState<Coin[]>([]); // Type state as Coin[]
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null); // Type state as Coin or null
  const [priceData, setPriceData] = useState<PriceData[]>([]); // Type state as PriceData[]
  const [isClient, setIsClient] = useState(false); // Flag to check if we're on the client
  const [isDataFetched, setIsDataFetched] = useState(false); // Flag for data fetch completion
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);  // Track the previous price

  useEffect(() => {
    setIsClient(true);
    const fetchCryptoCoins = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 20,
            page: 1,
          },
        });

        setCryptoCoins(response.data);
        setSelectedCoin(response.data[0]);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCryptoCoins();
    setIsDataFetched(true);
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      const fetchPriceData = async () => {
        try {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart/range`,
            {
              params: {
                vs_currency: "usd",
                from: Math.floor(Date.now() / 1000) - 86400,
                to: Math.floor(Date.now() / 1000),
              },
            }
          );

          const formattedData = response.data.prices.map((item: any) => ({
            x: item[0],
            y: item.slice(1, 2),
          }));

          setPriceData(formattedData);

          // Update previous price (last close price)
          setPreviousPrice(formattedData[formattedData.length - 1]?.y[0]);
        } catch (error) {
          console.error("Error fetching price data:", error);
        }
      };

      fetchPriceData();
      const interval = setInterval(fetchPriceData, 60000);

      return () => clearInterval(interval);
    }
  }, [selectedCoin]);

  // ApexCharts options
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: [1],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.7,   // Intensity of the shade (for a more pronounced gradient)
        opacityFrom: 0.8,    // Set higher opacity at the top (line)
        opacityTo: 0.1,       // Set lower opacity at the bottom (X-axis)
        stops: [0, 100],    // Define gradient stops (from top to bottom)
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "HH:mm",
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
      },
    },
  };

  const series = [
    {
      name: selectedCoin?.name || "Price",
      data: priceData.map((price: PriceData) => ({
        x: price.x, // timestamp
        y: price.y, // price [close]
      })),
    },
  ];

  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  // Check if client-side rendering is complete and data is available
  if (!isClient || !isDataFetched) {
    return <div>Loading...</div>; // You can also show a loading spinner or something else
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Cryptocurrency Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monitor real-time statistics and changes.
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Cryptocurrency List
        </h4>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left">Logo</th> {/* Added Logo column */}
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">24h %</th>
                <th className="px-4 py-2 text-left">Market Cap</th>
                <th className="px-4 py-2 text-left">Volume (24h)</th>
                <th className="px-4 py-2 text-left">Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {cryptoCoins.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin)}
                  className={`cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white/90 ${
                    selectedCoin?.id === coin.id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <td className="px-4 py-2">
                    <img
                      src={coin.image}
                      alt={`${coin.name} logo`}
                      className="w-6 h-6 rounded-full"
                    />
                  </td> {/* Display coin logo */}
                  <td className="px-4 py-2">{coin.name}</td>
                  <td
                    className={`px-4 py-2 ${
                      previousPrice !== null
                        ? coin.current_price > previousPrice
                          ? "text-green-500"
                          : coin.current_price < previousPrice
                          ? "text-red-500"
                          : "text-gray-700"
                        : "text-gray-700" // Fallback for when previousPrice is null
                    }`}
                  >
                    ${coin.current_price.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      coin.price_change_percentage_24h !== undefined &&
                      coin.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h !== undefined
                      ? coin.price_change_percentage_24h.toFixed(2)
                      : "--"}
                    %
                  </td>
                  <td className="px-4 py-2">${coin.market_cap.toLocaleString()}</td>
                  <td className="px-4 py-2">${coin.total_volume.toLocaleString()}</td>
                  <td className="px-4 py-2">{coin.circulating_supply.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCoin && (
        <div className="hidden lg:block mt-6">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {selectedCoin.name} Stats
          </h5>
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center">
              <p className="text-gray-500 mr-2">Market Cap:</p>
              <p className="font-semibold dark:text-white/90">
                ${selectedCoin.market_cap.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 mr-2">24h Change:</p>
              <p  className={`px-4 py-2 ${
                      selectedCoin.price_change_percentage_24h !== undefined &&
                      selectedCoin.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>{selectedCoin.price_change_percentage_24h !== undefined
                      ? selectedCoin.price_change_percentage_24h.toFixed(2)
                      : "--"}
                    %</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 mr-2">Volume:</p>
              <p className="font-semibold dark:text-white/90">
                ${selectedCoin.total_volume.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 mr-2">Circulating Supply:</p>
              <p className="font-semibold dark:text-white/90">
                {selectedCoin.circulating_supply.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}