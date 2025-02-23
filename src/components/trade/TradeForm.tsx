'use client';
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests

const TradeForm: React.FC = () => {
  const [orderType, setOrderType] = useState<string>("buy");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [livePrice, setLivePrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<any[]>([]); // State for storing the top 20 coins
  const [balances, setBalances] = useState<any>({}); // User's coin balances

  // Fetch top 20 coins from CoinGecko API
  const fetchTopCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 20,
            page: 1,
          },
        }
      );
      setCoins(response.data); // Set the top 20 coins data
      setSelectedCoin(response.data[0].id); // Default to the first coin
    } catch (error) {
      console.error("Error fetching top coins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live price for the selected coin
  const fetchLivePrice = async (coin: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );
      setLivePrice(response.data[coin].usd); // Set the live price of the selected coin
    } catch (error) {
      console.error("Error fetching live price:", error);
      setLivePrice(0);
    } finally {
      setLoading(false);
    }
  };

  // Simulating fetching user's coin balances (Replace with actual API call)
  const fetchUserBalances = async () => {
    try {
      // Simulate an API request to get user balances
      const response = await axios.get("/api/user/balances"); // Replace with actual endpoint
      setBalances(response.data); // Example balance data
    } catch (error) {
      console.error("Error fetching user balances:", error);
    }
  };

  useEffect(() => {
    fetchTopCoins(); // Fetch top coins on component mount
    fetchUserBalances(); // Fetch user balances on mount
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      fetchLivePrice(selectedCoin); // Fetch live price whenever selected coin changes
    }
  }, [selectedCoin]);

  const handleOrderTypeChange = (type: string) => {
    setOrderType(type);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coin = e.target.value;
    setSelectedCoin(coin);
  };

  // Convert USD to Coin amount or Coin amount to USD based on order type
  const calculateEquivalent = () => {
    if (orderType === "buy") {
      return (quantity / livePrice).toFixed(6); // USD to Coin
    }
    return (quantity * livePrice).toFixed(2); // Coin to USD
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting order:", { orderType, quantity, selectedCoin });
  };

  // Get available coins based on user balance (only when selling)
  const getAvailableCoinsForSell = () => {
    if (orderType === "sell") {
      return coins.filter((coin) => balances[coin.id] > 0); // Show coins with non-zero balance
    }
    return coins; // Show all coins when buying
  };

  return (
    <div className="trade-form-container p-8 bg-gray-900 rounded-lg shadow-lg max-w-xl mx-auto">
      <form onSubmit={handleSubmit} data-e2e="ticketContainer">
        <div className="trade-form space-y-6">
          {/* Buy / Sell Switch */}
          <div className="flex justify-center space-x-4">
            <div
              className={`px-4 py-2 rounded-xl w-[200px] cursor-pointer text-white ${orderType === "buy" ? "bg-green-500" : "bg-gray-700"}`}
              onClick={() => handleOrderTypeChange("buy")}
            >
              Buy
            </div>
            <div
              className={`px-4 py-2 rounded-xl w-[200px] cursor-pointer text-white ${orderType === "sell" ? "bg-red-500" : "bg-gray-700"}`}
              onClick={() => handleOrderTypeChange("sell")}
            >
              Sell
            </div>
          </div>

          {/* Coin Selection and Input */}
          {orderType === "buy" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm text-gray-300">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  step="any"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="coin-select" className="block text-sm text-gray-300">
                  Select Coin
                </label>
                <select
                  id="coin-select"
                  onChange={handleCoinChange}
                  value={selectedCoin}
                  className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                >
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 text-gray-300">
                {quantity > 0 && !loading && livePrice > 0 && (
                  <span>
                    {calculateEquivalent()} {selectedCoin === "bitcoin" ? "BTC" : "ETH"}
                  </span>
                )}
                {loading && <span>Loading price...</span>}
                {livePrice === 0 && !loading && <span>Unable to fetch price</span>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm text-gray-300">
                  Amount ({selectedCoin === "bitcoin" ? "BTC" : "ETH"})
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  step="any"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="coin-select" className="block text-sm text-gray-300">
                  Select Coin
                </label>
                <select
                  id="coin-select"
                  onChange={handleCoinChange}
                  value={selectedCoin}
                  className="w-full p-3 mt-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                >
                  {getAvailableCoinsForSell().map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 text-gray-300">
                {quantity > 0 && !loading && livePrice > 0 && (
                  <span>
                    {calculateEquivalent()} USD
                  </span>
                )}
                {loading && <span>Loading price...</span>}
                {livePrice === 0 && !loading && <span>Unable to fetch price</span>}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold mt-4 ${orderType === "buy" ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"}`}
          >
            {orderType === "buy" ? "Buy Order" : "Sell Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
