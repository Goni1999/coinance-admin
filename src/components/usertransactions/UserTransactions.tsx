'use client';
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Alert from "../ui/alert/Alert";

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
  email: string;
  transactions: Transaction[]; // Transactions are added to the User interface
}

const TransactionsHistory = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const t = useTranslations();
  const token = sessionStorage.getItem("auth-token");
  const [searchTerm, setSearchTerm] = useState("");
const [isExpanded, setIsExpanded] = useState<boolean | number>(-1); // Track which address is expanded
const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null); // The transaction to delete
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For the delete confirmation modal
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

  const openDeleteModal = (transaction: Transaction) => {
    setTransactionToDelete(transaction); // Store the full transaction object
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };
  

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close confirmation modal
    setTransactionToDelete(null); // Reset the transaction
  };
  const handleDeleteTransaction = async () => {
    if (!transactionToDelete?.transaction_id) {
      setAlert({
        variant: "success",
        title: "User Balance Updated Successfully",
        message: "You can check now!",
        show: true,

      });
      return;
    }
  
    try {
      const response = await fetch(`https://server.capital-trust.eu/api/admin-transactions-delete`, {
        method: "POST", // Keep the DELETE method
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionToDelete.transaction_id, // Send transactionId in the request body
        }),
      });
  
      if (response.ok) {
        // Refresh the user data after the transaction is deleted
        const updatedUsers = users.map(user => {
          if (user.id === selectedUser?.id) {
            user.transactions = user.transactions.filter(
              transaction => transaction.transaction_id !== transactionToDelete?.transaction_id
            );
          }
          return user;
        });
  
        setUsers(updatedUsers);
        setAlert({
          variant: "success",
          title: "Transaction deleted successfully!",
          message: "",
          show: true,

        });
      } else {
        setAlert({
          variant: "error",
          title: "Failed to delete transaction.",
          message: "Please try again!",
          show: true,

        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setAlert({
        variant: "error",
        title: "Error deleting transaction.",
        message: "Please try again!",
        show: true,

      });
    }
  
    closeDeleteModal(); // Close the modal after deletion
  };
  
    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
   // Filter transactions based on the search term
const filteredTransactions = selectedUser?.transactions?.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.time.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.balance_id.toLowerCase().includes(searchLower) ||
      transaction.coin.toLowerCase().includes(searchLower) ||
      transaction.amount.toLowerCase().includes(searchLower) ||
      transaction.destination.toLowerCase().includes(searchLower) ||
      transaction.txid.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower)
    );
  }) || [];
  
  
    const formatDate = (dateString: string): string => {
      if (!dateString) return "01.01.2000"; // Default date
    
      const date = new Date(dateString); // Convert to Date object
    
      // Extract day, month, and year
      const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure two digits
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is zero-based
      const year = date.getUTCFullYear();
    
      return `${day}.${month}.${year}`;
    };
  
    const formatAmount = (amount: string): string => {
      const amountNumber = parseFloat(amount);
    
      if (isNaN(amountNumber)) {
        return 'Invalid amount'; // Return a fallback message if invalid number
      }
    
      if (amountNumber % 1 === 0) {
        return amountNumber.toFixed(0);
      } else {
        return amountNumber.toFixed(2);
      }
    };
    const handleToggle = (index: number) => {
      setIsExpanded(isExpanded === index ? -1 : index); // Toggle between expanded or not
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
              {users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                                      <span className="mt-2 w-full inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-red-50 dark:bg-red-500/15 text-red-500 hover:text-red-700 text-sm">{`${user.email}`}</span>

                  <div className="flex items-end justify-between mt-5">
                    <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.first_name}`}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{`${user.last_name}`}</span>

                      
                    </div>
                    <div className="flex flex-col items-end">
                    <button
                        onClick={() => openAddTransactionModal(user)}
                        className="mt-2 inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-green-50 dark:bg-green-500/15 text-green-500 hover:text-green-700 text-sm"
                      >
                        Add Transaction
                      </button>
                      <button
                        onClick={() => openTransactionModal(user)}
                        className="mt-2 inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Show All
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
        {alert.show  && (
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
              showLink={false} 
            />
          )}
          Transactions for {selectedUser?.first_name} {selectedUser?.last_name}
        </h3>
        <div className="col-span-12 mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Transactions
                </h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form>
                  <div className="relative">
                    <button className="absolute -translate-y-1/2 left-4 top-1/2">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                          fill="none"
                        ></path>
                      </svg>
                    </button>
                    <input
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                      type="text"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="max-w-full px-5 overflow-x-auto sm:px-6">
                <div>
                  <table className="min-w-full undefined">
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
                          {t("overview17")} {/* Status */}
                        </th>
                        <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {t("overview18")} {/* Details */}
                        </th>
                        <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          Action 
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
  {filteredTransactions.map((transaction, index) => (
    <tr key={index}>
      <td className="px-4 py-4 text-blue-700 text-theme-sm dark:text-blue-400 dark:border-gray-800">
        {formatDate(transaction.time)}
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
        {transaction.type}
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
        <span
          className="cursor-pointer"
          onClick={() => handleToggle(index)}
        >
          {isExpanded === index
            ? transaction.balance_id
            : `${transaction.balance_id.slice(0, 5)}...`}
        </span>
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
        {transaction.coin}
      </td>
      
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
        {formatAmount(transaction.amount)}
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
      <span
          className="cursor-pointer"
          onClick={() => handleToggle(index)}
        >
          {isExpanded === index
            ? transaction.destination
            : `${transaction.destination.slice(0, 5)}...`}
        </span> 
      </td>
      
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
        {transaction.txid}
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
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
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
      {transaction.details}
      </td>
      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
  <button
    onClick={() => openDeleteModal(transaction)}
    className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium bg-red-50 text-red-500 hover:text-red-700 text-sm"
  >
    Delete
  </button>
</td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
              </div>
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


      {/* Delete Confirmation Modal */}
      <Modal className="relative w-1/2 mx-auto p-4 pt-16 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11" isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
      <div className="relative w-1/2 mx-auto p-4 pt-16 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Are you sure you want to delete this transaction?
          </h3>
          <div className="flex justify-center mt-4">
            <button
              onClick={closeDeleteModal}
              className="mr-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTransaction}              
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                      >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsHistory;
