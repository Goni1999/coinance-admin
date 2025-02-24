'use client';

import Link from "next/link";
import React, { useState } from "react";

type Invoice = {
  id: number;
  status: string;
  amount: number;
  date: string;
};

const Invoices = () => {
  // Default invoice data
  const defaultInvoices: Invoice[] = [
    { id: 1, status: "Paid", amount: 1500, date: "2025-02-10" },
    { id: 2, status: "Pending", amount: 3000, date: "2025-02-15" },
    { id: 3, status: "Overdue", amount: 500, date: "2025-02-20" },
  ];

  // Set the default invoices into state
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoices(defaultInvoices);
  };

  const handleProceedToPayment = () => {
    if (selectedInvoice) {
      alert(`Proceeding to payment for invoice #${selectedInvoice.id}`);
    }
  };

  const handleDownloadInvoice = () => {
    if (selectedInvoice) {
      alert(`Downloading invoice #${selectedInvoice.id}`);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Invoices</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="/">
                Home
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Invoices</li>
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
                <div className="w-12 h-12 overflow-hidden rounded-full">
                  {/* Optionally add an image or avatar here */}
                </div>
                <div>
                  <span className="mb-0.5 block text-sm font-medium text-gray-800 dark:text-white/90">
                    Invoice #{invoice.id}
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
              <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">Invoice</h3>
              <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">ID : #{selectedInvoice.id}</h4>
            </div>
            <div className="p-5 xl:p-8">
              <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">From</span>
                  <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">Sender Name</h5>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Address Details here...
                  </p>
                  <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Issued On:</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">{selectedInvoice.date}</span>
                </div>
              </div>
              <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Sub Total amount: $ {selectedInvoice.amount}</p>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">Vat (10%): $ {selectedInvoice.amount * 0.1}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Total : $ {selectedInvoice.amount + selectedInvoice.amount * 0.1}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  onClick={handleProceedToPayment}
                >
                  Proceed to payment
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
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
