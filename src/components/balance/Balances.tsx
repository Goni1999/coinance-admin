"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import CoinDropdown from "../ecommerce/coinDropdows";

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
  const correctCoinId = coinIds[coin];

  if (!correctCoinId) {
    console.warn(`Invalid coin selected: ${coin}`);
    return 0; // Return 0 if coin is invalid
  }

  try {
    const response = await fetch(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${correctCoinId}&vs_currencies=usd`, {
      method: "GET",
      headers: {
        "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
      }
    });

    const data = await response.json();
    if (!data[correctCoinId] || !data[correctCoinId].usd) {
      console.warn(`No price found for ${coin}`);
      return 0;
    }

    return data[correctCoinId]?.usd || 0;
  } catch (error) {
    console.error("Error fetching coin price:", error);
    return 0; // Return 0 if there's an error
  }
};

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
};

export const Balance = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<{ [userId: string]: keyof Balance }>({});
  const [totalValues, setTotalValues] = useState<{ [userId: string]: number }>({});

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("auth-token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("https://server.capital-trust.eu/api/users-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const usersData: User[] = await response.json();

      // Log the users data to inspect balance property
      console.log("Fetched Users:", usersData);

      setUsers(usersData);

      const initialSelectedCoins: { [userId: string]: keyof Balance } = {};
      usersData.forEach((user) => {
        if (!user.balance) {
          console.warn(`User ${user.id} is missing balance`);
          user.balance = {
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
          }; // Initialize balance if missing
        }
        initialSelectedCoins[user.id] = "bitcoin"; // Default coin selection is "bitcoin"
      });

      setSelectedCoins(initialSelectedCoins);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      const newTotalValues: { [userId: string]: number } = {};

      for (const user of users) {
        const selectedCoin = selectedCoins[user.id] || "bitcoin"; // Default to "bitcoin"
        const price = await getLiveCoinPrice(selectedCoin);
        const coinBalance = user.balance?.[selectedCoin] ?? 0;
        newTotalValues[user.id] = price * coinBalance;
      }

      setTotalValues(newTotalValues);
    };

    if (users.length > 0) {
      fetchPrices();
    }
  }, [users, selectedCoins]);

  const handleCoinChange = (userId: string, coin: keyof Balance) => {
    setSelectedCoins((prev) => ({
      ...prev,
      [userId]: coin, // Update only for the specific user
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {user.balance?.[selectedCoins[user.id] || "bitcoin"] ?? 0}{" "}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <CoinDropdown
                    selectedCoin={selectedCoins[user.id] || "bitcoin"}
                    onCoinChange={(coin) => handleCoinChange(user.id, coin)}
                    balance={user.balance}
                  />
                </p>
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              ${totalValues[user.id] > 0 ? totalValues[user.id].toFixed(2) : "Unavailable"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
