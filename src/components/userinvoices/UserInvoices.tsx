import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  invoices: Invoice[];
  address: string; // User address field for details
};

type Invoice = {
  id: number;
  user_id: string;
  issued_date: string;
  sub_total: number;
  vat: number;
  total: number;
  link_of_pdf: string;
  status: string; // 'paid' or 'unpaid'
};

const Invoices = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('auth-token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      try {
        const usersResponse = await fetch('https://server.capital-trust.eu/api/users-admin', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData: User[] = await usersResponse.json();

        const invoicesResponse = await fetch('https://server.capital-trust.eu/api/admin-invoices', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!invoicesResponse.ok) throw new Error('Failed to fetch invoices');
        const invoicesData: Invoice[] = await invoicesResponse.json();

        const usersWithInvoices = usersData.map((user) => {
          user.invoices = invoicesData.filter((invoice) => invoice.user_id === user.id);
          return user;
        });

        setUsers(usersWithInvoices);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user === selectedUser ? null : user); // Toggle selection
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInvoiceStatusClass = (status: string) => {
    if (status === 'paid') return 'bg-green-50 dark:green-500/15 text-green-500';
    if (status === 'unpaid') return 'bg-red-50 dark:bg-red-500/15 text-red-500';
    return '';
  };

  const getSelectedUserClass = (user: User) => {
    return user === selectedUser
      ? 'bg-blue-400 text-white' // Selected user with blue background
      : '';
  };

  const getSelectedInvoiceClass = (invoice: Invoice) => {
    return invoice === selectedInvoice
      ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-500' // Add selected background and text color
      : '';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{t('inv1')}</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                href="/"
              >
                {t('inv2')}
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">{t('inv1')}</li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row">
        {/* Left Panel: User List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] xl:w-1/5">
          <div className="space-y-1">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${getSelectedUserClass(user)}`}
                onClick={() => handleUserClick(user)}
              >
                <div>
                  <span className="mb-0.5 block text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Invoice List and Details */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-4/5 flex flex-col">
          {selectedUser && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">{t('inv3')}</h3>
                <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
                  User: {selectedUser.first_name} {selectedUser.last_name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Address: {selectedUser.address}
                </p>
              </div>

              <div className="flex gap-6 p-5 xl:p-8">
                {/* Left Column: Invoices List */}
                <div className="flex flex-col w-1/3 space-y-3">
                  {selectedUser.invoices.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">
                      No invoices for {selectedUser.first_name} {selectedUser.last_name}.
                    </div>
                  ) : (
                    selectedUser.invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className={`cursor-pointer flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${getInvoiceStatusClass(invoice.status)} ${getSelectedInvoiceClass(invoice)}`}
                        onClick={() => handleInvoiceClick(invoice)}
                      >
                        
                        <div>
                          <span className="block text-sm font-medium text-red-500 hover:text-red-700">
                            Invoice #{invoice.id} - {formatDate(invoice.issued_date)}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400">{invoice.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Panel: Selected Invoice Details */}
{selectedInvoice && (
  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-4/5">
    {/* Header Section */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">{t("inv3")}</h3>
      <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">ID: #{selectedInvoice.id}</h4>
    </div>

    {/* Invoice Details Section */}
    <div className="p-5 xl:p-8">
      <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">{t("inv4")}</span>
          <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">Capital Trust</h5>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            123 Crypto Lane, Blockchain City, USA
          </p>
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{t("inv5")}:</span>
          <span className="block text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedInvoice.issued_date)}</span>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{t("inv6")}: $ {selectedInvoice.sub_total}</p>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {t("inv7")} ({selectedInvoice.vat}%): $ {selectedInvoice.sub_total * (selectedInvoice.vat / 100)}
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("inv8")} : $ {selectedInvoice.total}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/managewallet-deposit">
          <button
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            {t("inv9")}
          </button>
        </Link>
        <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => window.open(selectedInvoice.link_of_pdf, '_blank')}
                    >
          {t("inv10")}
        </button>
      </div>
    </div>
  </div>
)}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
