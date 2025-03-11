'use client';
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Transaction {
  transaction_id?: number;
  user_id: string;
  balance_id: string;
  time: string;
  type: string;
  coin: string;
  amount: string;
  destination: string;
  txid: string;
  status: string;
  details: string;
  admin_email: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  transactions: Transaction[];
}

const TransactionsHistory = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const t = useTranslations();

  useEffect(() => {
    // Fetch users
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

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchTransactions = async (userId: string) => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("https://server.capital-trust.eu/api/transactions-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const transactionsData = await response.json();
        const userTransactions = transactionsData.filter(
          (transaction: Transaction) => transaction.user_id === userId
        );
        setTransactions(userTransactions);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const openTransactionModal = (user: User) => {
    setSelectedUser(user);
    setIsTransactionModalOpen(true);
    fetchTransactions(user.id); // Fetch transactions when a user is selected
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
  };

  const closeAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
  };

  const openAddTransactionModal = (user: User) => {
    setSelectedUser(user);
    setIsAddTransactionModalOpen(true);
  };

  const handleTransactionChange = (field: keyof Transaction, value: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) => ({
        ...transaction,
        [field]: value,
      }))
    );
  };

  const handleAddTransaction = async () => {
    if (selectedUser && transactions) {
      const token = sessionStorage.getItem("auth-token");

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("https://server.capital-trust.eu/api/add-transaction", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactions),
        });

        if (response.ok) {
          console.log("Transaction added successfully!");
          setIsAddTransactionModalOpen(false);
        } else {
          console.error("Failed to add transaction");
        }
      } catch (error) {
        console.error("Error adding transaction:", error);
      }
    }
  };

  return (
    <div className="col-span-12">
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("transaction1")}</h3>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="max-w-full px-5 overflow-x-auto sm:px-6">
            <div>
              {users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                  <div className="flex items-end justify-between mt-5">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => openTransactionModal(user)}
                        className="mt-2 inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Show All
                      </button>
                      <button
                        onClick={() => openAddTransactionModal(user)}
                        className="mt-2 inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-green-50 dark:bg-green-500/15 text-green-500 hover:text-green-700 text-sm"
                      >
                        Add Transaction
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {isTransactionModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeTransactionModal}>Close</button>
            <h3>Transactions for {selectedUser.first_name} {selectedUser.last_name}</h3>
            <div>
              {transactions.length === 0 ? (
                <p>No transactions yet</p>
              ) : (
                transactions.map((transaction, index) => (
                  <div key={index}>
                    <p>Time: {transaction.time}</p>
                    <p>Type: {transaction.type}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Status: {transaction.status}</p>
                    <p>Transaction ID: {transaction.txid}</p>
                    <p>Balance ID: {transaction.balance_id}</p>
                    <hr />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isAddTransactionModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeAddTransactionModal}>Close</button>
            <h3>Add Transaction for {selectedUser.first_name} {selectedUser.last_name}</h3>

            {/* Type */}
            <div>
              <label>Type</label>
              <select
                value={transactions[0]?.type || ""}
                onChange={(e) => handleTransactionChange("type", e.target.value)}
              >
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>
            </div>

            {/* Coin */}
            <div>
              <label>Coin</label>
              <input
                type="text"
                value={transactions[0]?.coin || ""}
                onChange={(e) => handleTransactionChange("coin", e.target.value)}
              />
            </div>

            {/* Amount */}
            <div>
              <label>Amount</label>
              <input
                type="text"
                value={transactions[0]?.amount || ""}
                onChange={(e) => handleTransactionChange("amount", e.target.value)}
              />
            </div>

            {/* Destination */}
            <div>
              <label>Destination</label>
              <input
                type="text"
                value={transactions[0]?.destination || ""}
                onChange={(e) => handleTransactionChange("destination", e.target.value)}
              />
            </div>

            {/* TXID */}
            <div>
              <label>Transaction ID (TXID)</label>
              <input
                type="text"
                value={transactions[0]?.txid || ""}
                onChange={(e) => handleTransactionChange("txid", e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label>Status</label>
              <select
                value={transactions[0]?.status || ""}
                onChange={(e) => handleTransactionChange("status", e.target.value)}
              >
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Details */}
            <div>
              <label>Details</label>
              <textarea
                value={transactions[0]?.details || ""}
                onChange={(e) => handleTransactionChange("details", e.target.value)}
              />
            </div>

            {/* Add Transaction Button */}
            <button onClick={handleAddTransaction}>Add Transaction</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;
