'use client';
import React, { useState } from "react";

const RecentTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const transactions = [
    {
      time: "Nov 23, 01:00 PM",
      type: "Deposit",
      wallet: "Wallet A",
      coin: "BTC",
      amount: "$5,000.00",
      destination: "Exchange B",
      txId: "TXID123456",
      status: "Success",
    },
    {
      time: "Nov 23, 02:00 PM",
      type: "Withdraw",
      wallet: "Wallet B",
      coin: "ETH",
      amount: "$2,500.00",
      destination: "Wallet C",
      txId: "TXID789101",
      status: "Pending",
    },
    {
      time: "Nov 23, 03:30 PM",
      type: "Deposit",
      wallet: "Wallet C",
      coin: "ADA",
      amount: "$1,000.00",
      destination: "Wallet D",
      txId: "TXID112233",
      status: "Success",
    },
    {
      time: "Nov 23, 04:45 PM",
      type: "Withdraw",
      wallet: "Wallet D",
      coin: "LTC",
      amount: "$800.00",
      destination: "Exchange E",
      txId: "TXID445566",
      status: "Failed",
    },
    
  ];

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.time.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.wallet.toLowerCase().includes(searchLower) ||
      transaction.coin.toLowerCase().includes(searchLower) ||
      transaction.amount.toLowerCase().includes(searchLower) ||
      transaction.destination.toLowerCase().includes(searchLower) ||
      transaction.txId.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="col-span-12">
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Latest Transactions
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
                      Time
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Deposit Wallet
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Coin
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Destination
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      TxID
                    </th>
                    <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Status details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-blue-700 text-theme-sm dark:text-blue-400 dark:border-gray-800">
                        <div>{transaction.time}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.type}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.wallet}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.coin}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.destination}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        {transaction.txId}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
