'use client';
import React, { useState, useEffect } from "react";
import { ArrowUpIcon } from "@/icons";
import Badge from "../ui/badge/Badge";
import CoinDropdown from "../ecommerce/coinDropdows";

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

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  balance: Balance;
  selectedCoin: keyof Balance;
};

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

export const Balance = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [coinPrices, setCoinPrices] = useState<{ [key: string]: number }>({});

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) return console.error("No token found. Please log in.");

    try {
      const response = await fetch("https://server.capital-trust.eu/api/users-admin", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const usersData: User[] = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };





  const getLiveCoinPrice = async (coin: keyof Balance) => {
    const correctCoinId = coinIds[coin];
    if (!correctCoinId) {
      console.error(`Invalid coin id for ${coin}`);
      return 0;
    }
  
    try {
      const response = await fetch(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${correctCoinId}&vs_currencies=usd`, {
        method: "GET",
        headers: { "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu" }
      });
  
      if (!response.ok) {
        console.error(`Error fetching coin price for ${coin}`);
        return 0;
      }
  
      const data = await response.json();
      return data[correctCoinId]?.usd || 0;
    } catch (error) {
      console.error("Error fetching coin price:", error);
      return 0;
    }
  };
  

  const calculateTotalValue = (coin: keyof Balance, balance: number) => {
    const coinPrice = coinPrices[coin];
    return coinPrice * balance;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      const newCoinPrices: { [key: string]: number } = {};
      for (const coin in coinIds) {
        newCoinPrices[coin] = await getLiveCoinPrice(coin as keyof Balance);
      }
      setCoinPrices(newCoinPrices);
    };

    fetchPrices();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {user.balance && user.selectedCoin ? (
                    user.balance[user.selectedCoin] || 0
                  ) : (
                    0
                  )}


                <p className="text-sm text-gray-500 dark:text-gray-400">
                <CoinDropdown
                selectedCoin={user.selectedCoin || "bitcoin"} // Default to "bitcoin" if undefined
                onCoinChange={(coin) => {
                  setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === user.id ? { ...u, selectedCoin: coin } : u
                    )
                  );
                }}
                balance={user.balance}
              />

                </p>
              </h4>
            </div>
            <Badge color="success">
                      <ArrowUpIcon />
                      {user.selectedCoin ? (
                        coinPrices[user.selectedCoin] ? (
                          <span>
                            {calculateTotalValue(user.selectedCoin, user.balance[user.selectedCoin]).toFixed(2)}
                          </span>
                        ) : (
                          <span>Price Unavailable</span>
                        )
                      ) : (
                        <span>Coin not selected</span>
                      )}
</Badge>

          </div>

          <div className="flex justify-end mt-2">
            <button
             
              className="text-sm rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-theme-sm font-medium shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              Edit Balance
            </button>
          </div>
        </div>
      ))}

     
    </div>
  );
};
