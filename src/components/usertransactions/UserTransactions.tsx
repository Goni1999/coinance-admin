'use client';
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
    <div className="overflow-hidden mt-6">
      <div className="max-w-full px-5 overflow-x-auto sm:px-6">
        <div>
          <table className="min-w-full">
            <thead className="border-gray-200 border-y dark:border-gray-800">
              <tr>
                <th className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview10")} {/* Time */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview11")} {/* Type */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview12")} {/* Balance ID */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview13")} {/* Coin */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview14")} {/* Amount */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview15")} {/* Status */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview16")} {/* TXID */}
                </th>
                <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {t("overview17")} {/* Details */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {selectedUser?.transactions?.length === 0 ? (
                <tr>
                  <td  className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                selectedUser?.transactions?.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-blue-700 dark:text-blue-400">
                      <div>{transaction.time}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      <span
                        className="cursor-pointer"
                      >
                        {transaction.balance_id.slice(0, 5)}...
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      {transaction.coin}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      {transaction.amount}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${
                          transaction.status === "Success"
                            ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                            : transaction.status === "Failed"
                            ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                            : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      {transaction.txid}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-400">
                      {transaction.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
