'use client';
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import CoinDropdown from "../ecommerce/coinDropdows";
import EditModal from "./EditModal"; // Import the EditModal
import Alert from "../../components/ui/alert/Alert";

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
  balance: Balance | null;
  balance_id: string;
  status: string;
  usdt_total: number;
  unpaid_amount: number;
  deposit_wallet: string;
};

export const Balance = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<{ [userId: string]: keyof Balance }>({});
  const [totalValues, setTotalValues] = useState<{ [userId: string]: number }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal open state
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Selected user to edit
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
            const userBalance = balanceData.find((item: { user_id: string }) => item.user_id === user.id);

            if (userBalance) {
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
              user.deposit_wallet = userBalance?.deposit_wallet || "";
              user.balance_id = userBalance?.balance_id || "";
              user.unpaid_amount = userBalance?.unpaid_amount || "";
              user.usdt_total = userBalance?.usdt_total || "";
            } else {
              user.balance = null;
            }
          } else {
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
        if (!user.balance) continue;

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
      [userId]: coin,
    }));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleSubmitUpdatedBalance = async (updatedData: {
    balance_id: string;
    user_id: string;
    balance: Balance;
    status: string;
    usdt_total: number;
    unpaid_amount: number;
    deposit_wallet: string;
  }) => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
  
    // Collect only the fields that have been updated
    const updatedFields: { [key: string]: unknown } = {};
  
    // Compare balance
    if (JSON.stringify(updatedData.balance) !== JSON.stringify(selectedUser?.balance)) {
      updatedFields.balance = updatedData.balance;
    }
  // Compare status
  if (updatedData.balance_id !== selectedUser?.balance_id) {
    updatedFields.balance_id = updatedData.balance_id;
  }
    // Compare status
    if (updatedData.status !== selectedUser?.status) {
      updatedFields.status = updatedData.status;
    }
  
    // Compare USDT total
    if (updatedData.usdt_total !== selectedUser?.usdt_total) {
      updatedFields.usdt_total = updatedData.usdt_total;
    }
  
    // Compare unpaid amount
    if (updatedData.unpaid_amount !== selectedUser?.unpaid_amount) {
      updatedFields.unpaid_amount = updatedData.unpaid_amount;
    }
  
    // Compare deposit wallet
    if (updatedData.deposit_wallet !== selectedUser?.deposit_wallet) {
      updatedFields.deposit_wallet = updatedData.deposit_wallet;
    }
  
    // If no fields have changed, don't send the request
    if (Object.keys(updatedFields).length === 0) {
      console.log("No changes detected.");
      return;
    }
  
    // Add the user_id to the updated fields (because we need it for the backend)
    updatedFields.user_id = updatedData.user_id;
  
    try {
      // Send the request to the backend with user_id in the body
      const response = await fetch("https://server.capital-trust.eu/api/update-balance-admin", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
  
      if (response.ok) {
        console.log("User Balance updated successfully!");
        setAlert({
          variant: "success",
          title: "User Balance Updated Successfully",
          message: "You can check now!",
          show: true,
        });
        
        // Optionally, refetch or update the local state with the updated data
        const updatedUsers = users.map((user) =>
          user.id === updatedData.user_id
            ? { ...user, ...updatedFields } // Update only the changed fields
            : user
        );
        setUsers(updatedUsers);
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update balance");
        
        setAlert({
          variant: "error",
          title: "User Balance doesn't Updated",
          message: "Please signout and signin again",
          show: true,
        });
       
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {/* Display the user's selected coin balance */}
                {user.balance?.[selectedCoins[user.id] || "bitcoin"] ?? 0}
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
          {/* Edit button */}
          <button onClick={() =>  handleEdit(user)} className="text-blue-500 hover:text-blue-700 text-sm">
              Edit
            </button>
        </div>
      ))}

      {/* Modal */}
      {selectedUser && (
        
        <EditModal
        
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userId={selectedUser.id}
          balanceId={selectedUser.balance_id || ""}
          balance={selectedUser.balance || { bitcoin: 0, ethereum: 0, xrp: 0, tether: 0, bnb: 0, solana: 0, usdc: 0, dogecoin: 0, cardano: 0, staked_ether: 0 }}
          status={selectedUser.status || "Active"}
          usdtTotal={selectedUser.usdt_total || 0}
          unpaidAmount={selectedUser.unpaid_amount || 0}
          depositWallet={selectedUser.deposit_wallet || ""}
          onSubmit={handleSubmitUpdatedBalance}
        />
      )}
    </div>
  );
};
