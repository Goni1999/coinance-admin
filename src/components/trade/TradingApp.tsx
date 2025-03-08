'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ApexOptions } from "apexcharts";
import { useTranslations } from 'next-intl';

// Dynamically import the ReactApexChart component with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Disable server-side rendering for this component
});

type Coin = {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  high_24h: number;
  low_24h: number;
  total_volumes: number;
};

type PriceData = [number, number]; // [timestamp, price]

type FormattedData = {
  x: number; // Timestamp
  y: number; // Price
};

type SeriesData = {
  name: string;
  data: FormattedData[];
};


export default function TradingApp() {
  const [cryptoCoins, setCryptoCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [priceData, setPriceData] = useState<FormattedData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [balance] = useState({
    btc: 0,
    usdt: 1000.0,
  });
  const t = useTranslations();

  const [previousPrice, setPreviousPrice] = useState<number | null>(null); // Store previous price for comparison
  const [, setPriceChangeColor] = useState<string>(""); // For changing color of price

  // Fetch coin list from API
  useEffect(() => {
    const fetchCoins = async () => {
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
        setSelectedCoin(response.data[0]); // Default select the first coin
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();
  }, []);

  // Fetch price data for the selected coin
  useEffect(() => {
    if (selectedCoin) {
      const fetchPriceData = async () => {
        try {
          const response = await axios.get(
            `https://pro-api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart/range`,
            {
              params: {
                vs_currency: "usd",
                from: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago in seconds
                to: Math.floor(Date.now() / 1000), // Current time in seconds
              },
              headers: {
                "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
              }
            }
          );
      
          // Specify the type of `response.data.prices` as an array of `PriceData`
          const formattedData: FormattedData[] = response.data.prices.map((item: PriceData) => ({
            x: item[0], // Timestamp
            y: item[1], // Price
          }));
      
          setPriceData(formattedData); // Assuming setPriceData expects an array of FormattedData
       
      

          const currentPrice = response.data.prices[response.data.prices.length - 1][1];
          if (previousPrice !== null) {
            // Set color based on price increase or decrease
            if (currentPrice > previousPrice) {
              setPriceChangeColor("text-green-500");
            } else if (currentPrice < previousPrice) {
              setPriceChangeColor("text-red-500");
            }
          }
          setPreviousPrice(currentPrice); // Set the previous price
        } catch (error) {
          console.error("Error fetching price data:", error);
        }
      };
      fetchPriceData();
    }
  }, [selectedCoin, previousPrice]);

  // Toggle dropdown visibility
  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  // Handle coin selection
  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setIsOpen(false);
  };



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
        shadeIntensity: 0.7,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
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

  const series: SeriesData[] = [
    {
      name: selectedCoin?.name || "Price", // Fallback if selectedCoin is not available
      data: priceData.map((price: FormattedData) => ({
        x: price.x,
        y: price.y,
      })),
    },
  ];
  

  return (
    <div className="relative p-6">
      {/* Coin Dropdown */}
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle p-2 w-[150px] rounded-5x border border-gray-200 flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="block mr-1 font-medium text-theme-sm">
          {selectedCoin ? selectedCoin.name : "Select Coin"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <Dropdown
          className="absolute left-0 mt-[17px] flex w-[300px] flex-col rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <ul className="flex flex-col gap-0.5 pt-1 pb-1">
            {cryptoCoins.map((coin) => (
              <li key={coin.id}>
                <DropdownItem
                  onItemClick={() => handleCoinSelect(coin)}
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                  <span>{coin.name}</span>
                  <span>${coin.current_price.toFixed(2)}</span>
                  
                  {/* Price Change 24h */}
                  <span
                    className={`${coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"}`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </DropdownItem>
              </li>
            ))}
          </ul>
        </Dropdown>
      )}

      {/* Display Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {selectedCoin && (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
        </div>
      </div>
          <br/>
         {/* Table to Display Balance Information */}
         <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">{t("trade21")}</th>
                <th className="px-4 py-2 text-left">{t("trade30")}Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">{selectedCoin?.name}</td>
                <td className="px-4 py-2">{balance.btc}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">{t("trade22")}</td>
                <td className="px-4 py-2">${balance.usdt.toFixed(2)}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">{t("trade23")} {selectedCoin?.name}</td>
                <td className="px-4 py-2">${selectedCoin?.current_price.toFixed(2)}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">{t("trade24")}</td>
                <td className="px-4 py-2">${selectedCoin?.current_price.toFixed(2)}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">{t("trade25")}</td>
                <td className="px-4 py-2">${selectedCoin?.current_price.toFixed(2)}</td>
              </tr>
              <tr className="border-b">
  <td className="px-4 py-2">{t("trade26")}</td>
  <td className="px-4 py-2">
    {selectedCoin ? (
      <span
        className={`${
          selectedCoin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {selectedCoin.price_change_percentage_24h.toFixed(2)}%
      </span>
    ) : (
      <span className="text-gray-500">N/A</span>
    )}
  </td>
</tr>
<tr className="border-b">
  <td className="px-4 py-2">{t("trade27")}</td>
  <td className="px-4 py-2">
    {selectedCoin ? (
      <span
        className={`${
          selectedCoin.high_24h > selectedCoin.current_price ? 'text-green-500' : 'text-red-500'
        }`}
      >
        ${selectedCoin.high_24h.toFixed(2)}
      </span>
    ) : (
      <span className="text-gray-500">N/A</span>
    )}
  </td>
</tr>

<tr className="border-b">
  <td className="px-4 py-2">{t("trade28")}</td>
  <td className="px-4 py-2">
    {selectedCoin ? (
      <span
        className={`${
          selectedCoin.low_24h < selectedCoin.current_price ? 'text-red-500' : 'text-green-500'
        }`}
      >
        ${selectedCoin.low_24h.toFixed(2)}
      </span>
    ) : (
      <span className="text-gray-500">N/A</span>
    )}
  </td>
</tr>

              <tr>
                <td className="px-4 py-2">{t("trade29")}</td>
                <td className="px-4 py-2 text-gray-500">N/A {selectedCoin?.name}</td>
              </tr>
            </tbody>
          </table>
        </div>

      {/* Transaction Section */}
      
    </div>
  );
}
