'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
type Invoice = {
  id: number;
  user_id: string; // Assuming user_id is a string (varchar in DB)
  issued_date: string;
  sub_total: number;
  vat: number; // VAT percentage stored in the database
  total: number;
  link_of_pdf: string; // Link to the PDF
  status: string;
  created_at: string;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const t = useTranslations();
  // Fetch invoices when the component mounts
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("https://server.capital-trust.eu/api/invoices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch invoices.");
        }

        const data = await response.json();
        setInvoices(data); // Assuming the response data is an array of invoices
        setLoading(false); // Set loading to false after fetching data
      } catch {
        setError("Something went wrong.");
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

 

  // Handle download by redirecting the user to the PDF link
  const handleDownloadInvoice = () => {
    if (selectedInvoice) {
      // Open the PDF link in a new tab
      window.open(selectedInvoice.link_of_pdf, "_blank");
    }
  };
  

  const formatDate = (dateString: string): string => {
    if (!dateString) return "01.01.2000"; // Default date

    const date = new Date(dateString); // Convert to Date object

    // Extract day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is zero-based
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  };

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{t("inv1")}</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="/">
              {t("inv2")}
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">{t("inv1")}</li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row">
        {/* Left Panel: Invoice List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] xl:w-1/5">
          <div className="space-y-1">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03]"
                onClick={() => handleInvoiceClick(invoice)}
              >
                <div>
                  <span className="mb-0.5 block text-sm font-medium text-gray-800 dark:text-white/90">
                  {t("inv3")} #{invoice.id}
                  </span>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{invoice.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Selected Invoice Details */}
        {selectedInvoice && (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-4/5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">{t("inv3")}</h3>
              <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">ID : #{selectedInvoice.id}</h4>
            </div>
            <div className="p-5 xl:p-8">
              <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">{t("inv4")}</span>
                  <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">Capital Trust</h5>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    NY City, USA
                  </p>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{t("inv5")}:</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedInvoice.issued_date)}</span>
                </div>
              </div>
              <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{t("inv6")}: $ {selectedInvoice.sub_total}</p>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                {t("inv7")} ({selectedInvoice.vat}%): $ {selectedInvoice.sub_total * (selectedInvoice.vat / 100)}
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {t("inv8")} : $ {selectedInvoice.total}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Link href="/managewallet-deposit">
                <button
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  
                >
                 {t("inv9")} 
                </button></Link>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  onClick={handleDownloadInvoice}
                >
                 {t("inv10")} 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
