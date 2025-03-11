import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";

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
  transactions: Transaction[]; // Transactions are added to the User interface
}

const TransactionsHistory = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const t = useTranslations();
  const token = sessionStorage.getItem("auth-token");

  useEffect(() => {
    const fetchUsers = async () => {
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

          // Fetch transactions for each user and include them in the user object
          const usersWithTransactions = await Promise.all(
            usersData.map(async (user: User) => {
              const transactionsResponse = await fetch("https://server.capital-trust.eu/api/admin-transactions", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              if (transactionsResponse.ok) {
                const transactionsData = await transactionsResponse.json();
                const userTransactions = transactionsData.filter(
                  (transaction: Transaction) => transaction.user_id === user.id
                );
                user.transactions = userTransactions;
              } else {
                user.transactions = [];
              }

              return user;
            })
          );

          setUsers(usersWithTransactions);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const openTransactionModal = (user: User) => {
    setSelectedUser(user);
    setIsTransactionModalOpen(true);
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
      <Modal isOpen={isTransactionModalOpen} onClose={closeTransactionModal}>
        <div className="relative w-full p-4 pt-16 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Transactions for {selectedUser?.first_name} {selectedUser?.last_name}
          </h3>
          <div>
            {selectedUser?.transactions?.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              selectedUser?.transactions?.map((transaction, index) => (
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
      </Modal>

      {/* Add Transaction Modal */}
      <Modal isOpen={isAddTransactionModalOpen} onClose={closeAddTransactionModal}>
        <div className="relative w-full p-4 pt-16 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Transaction for {selectedUser?.first_name} {selectedUser?.last_name}
          </h3>

          {/* Type */}
          <div>
            <label>Type</label>
            <select>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>

          {/* Coin */}
          <div>
            <label>Coin</label>
            <Input type="text" value={""} />
          </div>

          {/* Amount */}
          <div>
            <label>Amount</label>
            <Input type="text" value={""} />
          </div>

          {/* Destination */}
          <div>
            <label>Destination</label>
            <Input type="text" value={""} />
          </div>

          {/* TXID */}
          <div>
            <label>Transaction ID (TXID)</label>
            <Input type="text" value={""} />
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label>Details</label>
            <textarea />
          </div>

          <button onClick={() => console.log("Transaction added!")}>Add Transaction</button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsHistory;
