'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
interface Transaction {
  time: string;
  type: string;
  balance_id: string;
  coin: string;
  amount: string;
  destination: string;
  txid: string;
  status: string;
}

const WithdrawTr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean | number>(-1); // Track which address is expanded

  const t = useTranslations();
  // Fetch transactions function
  const fetchTransactions = async () => {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://server.coinance.co/api/transactions-admin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data: Transaction[] = await response.json();

      sessionStorage.setItem('transactions', JSON.stringify(data));

      setTransactions(data);
    } catch {
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions
    .filter((transaction) => transaction.type === 'Withdraw') // Filter by Withdraw type
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // Sort by time descending
    .filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.time.toLowerCase().includes(searchLower) ||
        transaction.type.toLowerCase().includes(searchLower) ||
        String(transaction.balance_id).toLowerCase().includes(searchLower) ||
        transaction.coin.toLowerCase().includes(searchLower) ||
        transaction.amount.toLowerCase().includes(searchLower) ||
        transaction.destination.toLowerCase().includes(searchLower) ||
        transaction.txid.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower)
      );
    });

  const formatDate = (dateString: string): string => {
    if (!dateString) return '01.01.2000';
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatAmount = (amount: string): string => {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      return 'Invalid amount';
    }
    if (amountNumber % 1 === 0) {
      return amountNumber.toFixed(0);
    } else {
      return amountNumber.toFixed(2);
    }
  };

  useEffect(() => {

    fetchTransactions();
  }, []);

  const handleToggle = (index: number) => {
    setIsExpanded(isExpanded === index ? -1 : index); // Toggle between expanded or not
  };

  return (
    <div className="col-span-12">
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
             {t("withtr1")} 
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
            <table className="min-w-full">
              <thead className="border-gray-200 border-y dark:border-gray-800">
                <tr>
                  <th className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr2")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr3")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr4")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr5")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr6")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr7")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr8")}</th>
                  <th className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"> {t("withtr9")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-blue-700 text-theme-sm dark:text-blue-400 dark:border-gray-800">
                      <div>{formatDate(transaction.time)}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{transaction.type}</td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggle(index)} // Toggle for this row's address
                    >
                      {isExpanded === index ? transaction.balance_id : `${transaction.balance_id.slice(0, 5)}...`}
                    </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{transaction.coin}</td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{formatAmount(transaction.amount)}</td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400"> 
                    <span
                      className="cursor-pointer"
                      onClick={() => handleToggle(index)} // Toggle for this row's address
                    >
                      {isExpanded === index ? transaction.balance_id : `${transaction.balance_id.slice(0, 5)}...`}
                    </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{transaction.txid}</td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${
                          transaction.status === 'Success'
                            ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                            : transaction.status === 'Failed'
                            ? 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
                            : 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400'
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
  );
};

export default WithdrawTr;
