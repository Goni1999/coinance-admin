'use client';

import React, { useEffect, useState } from "react";
import Alert from "../ui/alert/Alert";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
}

const CryptoWithdraw: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [toCoin, setToCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
   const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    variant: "success",
    title: "",
    message: "",
    show: false,
  }); 
  // Corrected coin IDs mapping
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
    staked_ether: "staked-ether",
  };

  // Fetch available coins from the database
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await fetch("https://server.capital-trust.eu/api/coins", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (typeof data === "object" && data !== null) {
          const formattedCoins = Object.keys(data).map((symbol, index) => ({
            id: String(index),
            symbol: symbol.toUpperCase(),
            name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
            logo: `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/50`,
            balance: parseFloat(data[symbol]),
          }));

          setCoins(formattedCoins);
        } else {
          console.error("Unexpected response format:", data);
          setCoins([]);
        }
      } catch (error) {
        console.error("Failed to fetch coins:", error);
        setCoins([]);
      }
    };

    fetchCoins();
  }, []);

  // Fetch live conversion rate from CoinGecko API
  useEffect(() => {
    const fetchLivePrice = async () => {
      if (fromCoin && toCoin) {
        try {
          const fromCoinId = coinIds[fromCoin.symbol.toLowerCase()];
          const toCoinId = coinIds[toCoin.symbol.toLowerCase()];

          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoinId},${toCoinId}&vs_currencies=usd`
          );
          const data = await response.json();

          if (data[fromCoinId] && data[toCoinId]) {
            const fromCoinPrice = data[fromCoinId].usd;
            const toCoinPrice = data[toCoinId].usd;
            const conversionRate = fromCoinPrice / toCoinPrice;
            const calculatedAmount = amount * conversionRate;
            setConvertedAmount(calculatedAmount);
          } else {
            console.error("Error fetching conversion rate.");
          }
        } catch (error) {
          console.error("Failed to fetch live prices:", error);
        }
      }
    };

    fetchLivePrice();
  }, [fromCoin, toCoin, amount]);

  // Handle withdrawal and update balances in the database
  const handleWithdrawal = async () => {
    if (!fromCoin || !toCoin || amount <= 0) return;

    try {
      const token = sessionStorage.getItem("auth-token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      // Update the balances in the database
      const response = await fetch("https://server.capital-trust.eu/api/update-coins", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromCoin: fromCoin.symbol.toLowerCase(),
          toCoin: toCoin.symbol.toLowerCase(),
          fromAmount: amount,
          toAmount: convertedAmount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating database: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated balances:", data);

      // Update your local state (coins) with the new balances
      setCoins((prevCoins) => {
        const updatedCoins = prevCoins.map((coin) => {
          if (coin.symbol.toLowerCase() === fromCoin.symbol.toLowerCase()) {
            coin.balance -= amount;
          } else if (coin.symbol.toLowerCase() === toCoin.symbol.toLowerCase()) {
            coin.balance += convertedAmount || 0;
          }
          return coin;
        });
        return updatedCoins;
      });

      setAlert({
        variant: "success",
        title: "Withdrawal processed successfully!",
        message: "After confirm your transaction will appear in transactions list.",
        show: true
      }); 
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
      setAlert({
        variant: "error",
        title: "Failed to process withdrawal:",
        message: "",
        show: true
      }); 
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-white/[0.03] rounded-lg shadow-md p-6">
        {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white/90">Crypto Withdrawal</h2>

      {/* Select Coin */}
      <div className="mb-6 ">
        <div className="flex items-center space-x-3 ">
          <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-full ${fromCoin ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
            {fromCoin ? "✓" : "1"}
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">Select Coin</h3>
        </div>
        <select
          className="w-full mt-2 p-2 border rounded bg-white dark:bg-white/[0.03] text-gray-800 dark:text-white/90"
          value={fromCoin?.id || ""}
          onChange={(e) => setFromCoin(coins.find((coin) => coin.id === e.target.value) || null)}
        >
          <option value="" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Select a coin</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id} className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">
              {coin.symbol} - {coin.name} (Balance: {coin.balance})
            </option>
          ))}
        </select>
      </div>

      {/* Select Destination Coin */}
      <div className="mb-6 ">
        <div className="flex items-center space-x-3 ">
          <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-full ${toCoin ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
            {toCoin ? "✓" : "2"}
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">Withdraw to Coin</h3>
        </div>
        <select
            className="w-full mt-2 p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={toCoin?.id || ""}
            onChange={(e) => setToCoin(coins.find((coin) => coin.id === e.target.value) || null)}
            disabled={!fromCoin}
            >
            <option value="" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">
                Select a coin
            </option>
            {coins
                .filter((coin) => coin.id !== fromCoin?.id)
                .map((coin) => (
                <option
                    key={coin.id}
                    value={coin.id}
                    className="text-gray-800 dark:text-white bg-white dark:bg-gray-800"
                >
                    {coin.symbol} - {coin.name}
                </option>
                ))}
            </select>

      </div>

      {/* Enter Amount */}
      <div className="mb-6 ">
        <div className="flex items-center space-x-3 ">
          <div className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded-full ${(amount > 0 && amount <= (fromCoin?.balance || 0)) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
            {(amount > 0 && amount <= (fromCoin?.balance || 0)) ? "✓" : "3"}
          </div>
          <h3 className="text-lg font-medium  text-gray-800 dark:text-white/90">Enter Amount</h3>
        </div>
        <input
          type="number"
          className="w-full mt-2 p-2 border rounded text-gray-800 dark:text-white/90  bg-white dark:bg-white/[0.03]"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          min={0}
          max={fromCoin?.balance || 0}
          disabled={!fromCoin || !toCoin}
        />
        {convertedAmount !== null && toCoin && (
          <p className="text-gray-800 mt-2 text-gray-800 dark:text-white/90">
            You will receive: <strong>{convertedAmount.toFixed(6)} {toCoin.symbol}</strong>
          </p>
        )}
      </div>

      {/* Withdraw Button */}
      <button
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        disabled={!fromCoin || !toCoin || amount <= 0 || amount > (fromCoin?.balance || 0)}
        onClick={handleWithdrawal}
      >
        Convert & Withdraw
      </button>
    </div>
  );
};

export default CryptoWithdraw;
