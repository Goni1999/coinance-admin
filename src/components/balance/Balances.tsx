"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
// import { useTranslations } from "next-intl";
import { ArrowUpIcon } from "@/icons";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
// Type definition for balance state
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

// Type definition for user state
type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  balance: Balance;
};

export const Balance = () => {
//  const t = useTranslations();
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
    staked_ether: 0,
  });

  // Fetch users data (replace with actual API request)
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
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Open the modal and set the selected user and balance
  const openModal = (user: User) => {
    setSelectedUser(user);
    setEditedBalance(user.balance); // Set the current balance in the modal state
    setIsModalOpen(true);
  };

  // Close the modal
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
      staked_ether: 0,
    }); // Reset the balance when closing the modal
  };

  // Handle balance change in the modal
  const handleBalanceChange = (coin: keyof Balance, value: number) => {
    if (editedBalance) {
      setEditedBalance((prev) => ({
        ...prev,
        [coin]: value, // Always set a number, not undefined
      }));
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (selectedUser && editedBalance) {
      try {
        const token = sessionStorage.getItem("auth-token");

        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        // Send the updated balance to the backend
        const response = await fetch(`https://server.capital-trust.eu/api/balance-admin/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ balance: editedBalance }),
        });

        if (!response.ok) throw new Error("Failed to update balance");

        // Close the modal after saving
        closeModal();
        alert("Balance updated successfully");
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {user.balance.bitcoin || 0} {/* You can choose to display the specific coin here */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {/* You can also show the selected coin balance here */}
                </p>
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              ${user.balance.bitcoin ? user.balance.bitcoin.toFixed(2) : "Unavailable"}
            </Badge>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => openModal(user)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
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
                {Object.keys(editedBalance).map((coin) => (
                  <div key={coin} className="flex flex-col">
                    <label className="px-4 py-3 font-normal text-gray-500 dark:text-gray-400">
                      {coin.charAt(0).toUpperCase() + coin.slice(1)}
                    </label>
                    <input
                      type="number"
                      name={coin}
                      value={editedBalance[coin as keyof Balance]}
                      onChange={(e) => handleBalanceChange(coin as keyof Balance, parseFloat(e.target.value))}
                    />
                  </div>
                ))}
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
