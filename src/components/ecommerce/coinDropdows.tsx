"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Function to get live coin price from an external API (CoinGecko API as an example)
const getLiveCoinPrice = async (coin: string) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();
    return data[coin]?.usd || 0; // Return USD price
  } catch (error) {
    console.error("Error fetching coin price:", error);
    return 0; // Return 0 if the API call fails
  }
};

// Define the shape of the balance object
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

interface CoinDropdownProps {
  selectedCoin: keyof Balance;  // Now selectedCoin is a key of Balance
  onCoinChange: (coin: keyof Balance) => void;  // onCoinChange accepts a key of Balance
  balance: Balance; // Balance is typed as the object with specific keys
}

export default function CoinDropdown({ selectedCoin, onCoinChange, balance }: CoinDropdownProps) {
  // Coin options (you can dynamically generate these from a list of supported coins)
  const coins: (keyof Balance)[] = ["bitcoin", "ethereum", "xrp", "tether", "bnb", "solana", "usdc", "dogecoin", "cardano", "staked_ether",];

  // Toggle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Coin price and total value state
  const [, setCoinPrice] = useState<number>(0);
  const [, setTotalValue] = useState<number>(0);

  // Toggle dropdown visibility
  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  // Close dropdown when clicking outside
  function closeDropdown() {
    setIsOpen(false);
  }

  // Handle coin selection
  const handleCoinSelect = async (coin: keyof Balance) => {
    onCoinChange(coin); // Notify the parent component of the coin change
    closeDropdown(); // Close the dropdown

    // Fetch the live price for the selected coin
    const price = await getLiveCoinPrice(coin);
    setCoinPrice(price);

    // Calculate the total value of the selected coin based on the user's balance
    const coinBalance = balance[coin] || 0; // Default to 0 if balance for this coin is not available
    setTotalValue(price * coinBalance);
  };

  // Fetch coin price and total value when the selected coin changes
  useEffect(() => {
    const fetchPriceAndValue = async () => {
      const price = await getLiveCoinPrice(selectedCoin);
      setCoinPrice(price);

      const coinBalance = balance[selectedCoin] || 0;
      setTotalValue(price * coinBalance);
    };

    fetchPriceAndValue();
  }, [selectedCoin, balance]);

  return (
    <div className="relative">
      {/* Coin Selector */}
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        {/* Display selected coin */}
        <span className="block mr-1 font-medium text-theme-sm">{selectedCoin.toUpperCase()}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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

      {/* Coin Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <ul className="flex flex-col gap-0.5 pt-1 pb-1">
          {coins.map((coin) => (
            <li key={coin}>
              <DropdownItem
                onItemClick={() => handleCoinSelect(coin)}
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <span>{coin.toUpperCase()}</span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
