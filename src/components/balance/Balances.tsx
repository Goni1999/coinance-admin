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
  balance: Balance | null; // Allow null for balance if not found
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

      // Fetch balance for each user
      const usersWithBalance = await Promise.all(
        usersData.map(async (user) => {
          const balanceResponse = await fetch("https://server.capital-trust.eu/api/balance-admin", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();

            // Here, `item` will be typed as a `Balance` object
            const userBalance = balanceData.find((item: { user_id: string }) => item.user_id === user.id);

            if (userBalance) {
              // Parse the balance values as numbers
              user.balance = {
                bitcoin: parseFloat(userBalance.bitcoin) || 0,
                ethereum: parseFloat(userBalance.ethereum) || 0,
                xrp: parseFloat(userBalance.xrp) || 0,
                tether: parseFloat(userBalance.tether) || 0,
                bnb: parseFloat(userBalance.bnb) || 0,
                solana: parseFloat(userBalance.solana) || 0,
                usdc: parseFloat(userBalance.usdc) || 0,
                dogecoin: parseFloat(userBalance.dogecoin) || 0,
                cardano: parseFloat(userBalance.cardano) || 0,
                staked_ether: parseFloat(userBalance.staked_ether) || 0,
              };
            } else {
              console.log(`No balance found for user: ${user.id}`);
              user.balance = null; // If no balance found, set it as null
            }
          } else {
            console.error("Failed to fetch balance for user:", user.id);
            user.balance = null;
          }
          return user;
        })
      );

      setUsers(usersWithBalance);

      const initialSelectedCoins: { [userId: string]: keyof Balance } = {};
      usersWithBalance.forEach((user) => {
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
        if (!user.balance) {
          console.log(`Skipping user with no balance: ${user.id}`);
          continue; // Skip users without a balance
        }

        const selectedCoin = selectedCoins[user.id] || "bitcoin"; // Default to "bitcoin"
        const price = await getLiveCoinPrice(selectedCoin);
        const coinBalance = user.balance[selectedCoin] || 0;
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
                {/* Here, ensure you are displaying the balance correctly */}
                {user.balance?.[selectedCoins[user.id] || "bitcoin"] ?? 0}{" "}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <CoinDropdown
                    selectedCoin={selectedCoins[user.id] || "bitcoin"}
                    onCoinChange={(coin) => handleCoinChange(user.id, coin)}
                    balance={user.balance || { bitcoin: 0, ethereum: 0, xrp: 0, tether: 0, bnb: 0, solana: 0, usdc: 0, dogecoin: 0, cardano: 0, staked_ether: 0 }}
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
