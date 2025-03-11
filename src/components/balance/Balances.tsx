'use client';
import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { ArrowUpIcon } from "@/icons";
import Button from "../ui/button/Button";
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedBalance, setEditedBalance] = useState<Balance>({
    bitcoin: 0,
    ethereum: 0,
    xrp: 0,
    tether: 0,
    bnb: 0,
    solana: 0,
    usdc: 0,
    dogecoin: 0,
    cardano: 0,
    staked_ether: 0
  });

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

  const openModal = (user: User) => {
    setSelectedUser(user);
    setEditedBalance(user.balance);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditedBalance({
      bitcoin: 0,
      ethereum: 0,
      xrp: 0,
      tether: 0,
      bnb: 0,
      solana: 0,
      usdc: 0,
      dogecoin: 0,
      cardano: 0,
      staked_ether: 0
    });
  };

  const handleBalanceChange = (coin: keyof Balance, value: string) => {
    setEditedBalance((prev) => ({
      ...prev,
      [coin]: value ? parseFloat(value) : 0
    }));
  };

  const handleSaveChanges = async () => {
    if (selectedUser && editedBalance) {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (!token) return console.error("No token found. Please log in.");

        const response = await fetch(`https://server.capital-trust.eu/api/balance-admin/${selectedUser.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ balance: editedBalance })
        });

        if (!response.ok) throw new Error("Failed to update balance");
        closeModal();
        alert("Balance updated successfully");
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  const getLiveCoinPrice = async (coin: string) => {
    const correctCoinId = coinIds[coin];
    try {
      const response = await fetch(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${correctCoinId}&vs_currencies=usd`, {
        method: "GET",
        headers: { "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu" }
      });

      if (!response.ok) {
        throw new Error("Error fetching coin price");
      }

      const data = await response.json();
      return data[correctCoinId]?.usd || 0;  // Safely access data to avoid errors.
    } catch (error) {
      console.error("Error fetching coin price:", error);
      return 0;  // Return a default value if an error occurs
    }
  };

  // Calculate total value based on the selected coin for each user
  const calculateTotalValue = async (user: User) => {
    const price = await getLiveCoinPrice(user.selectedCoin);
    const coinBalance = user.balance[user.selectedCoin] || 0;
    return price * coinBalance;
  };

  useEffect(() => {
    fetchUsers();
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
                    selectedCoin={user.selectedCoin}
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
              {/* Calculate the total value dynamically for each user */}
              <span>
                {calculateTotalValue(user).then(value => (
                  value > 0 ? value.toFixed(2) : "Unavailable"
                ))}
              </span>
            </Badge>
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={() => openModal(user)}
              className="text-sm rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-theme-sm font-medium shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              Edit Balance
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {isModalOpen && selectedUser && editedBalance && (
        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Balance for {selectedUser.first_name} {selectedUser.last_name}
            </h4>
            <form className="flex flex-col">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                {Object.keys(editedBalance).map((coin) => {
                  if (coin) {
                    return (
                      <div key={coin} className="flex flex-col">
                        <label className="px-4 py-3 font-normal text-gray-500 dark:text-gray-400">
                        </label>
                        <input
                          type="number"
                          name={coin}
                          value={editedBalance[coin as keyof Balance] ?? 0}  // This ensures a default value of 0 if the balance is undefined.
                          onChange={(e) => handleBalanceChange(coin as keyof Balance, e.target.value)}
                        />
                      </div>
                    );
                  }
                  return null; // In case the coin is undefined or invalid, we return null to avoid rendering the element.
                })}
              </div>

              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button className="px-4 py-3 font-normal text-gray-500 dark:text-gray-400" size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button className="px-4 py-3 font-normal text-gray-500 dark:text-gray-400" size="sm" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
