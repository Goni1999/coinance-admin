'use client';

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

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

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  balanceId: string;
  balance: Balance;
  status: string;
  usdtTotal: number;
  unpaidAmount: number;
  depositWallet: string;
  onSubmit: (updatedData: {
    balance_id: string;
    user_id: string;
    balance: Balance;
    status: string;
    usdt_total: number;
    unpaid_amount: number;
    deposit_wallet: string;
  }) => void;
};

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  userId,
  balanceId,
  balance,
  status,
  usdtTotal,
  unpaidAmount,
  depositWallet,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    balance_id: balanceId,
    user_id: userId,
    balance: { ...balance },
    status,
    usdt_total: usdtTotal,
    unpaid_amount: unpaidAmount,
    deposit_wallet: depositWallet,
  });

  // Update form data when modal is opened with a new user
  useEffect(() => {
    if (isOpen) {
      setFormData({
        balance_id: balanceId,
        user_id: userId,
        balance: { ...balance },
        status,
        usdt_total: usdtTotal,
        unpaid_amount: unpaidAmount,
        deposit_wallet: depositWallet,
      });
    }
  }, [isOpen, userId, balanceId, balance, status, usdtTotal, unpaidAmount, depositWallet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('balance.')) {
      const coin = name.split('.')[1] as keyof Balance;
      setFormData((prev) => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Balance
        </h4>
        <form className="flex flex-col">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
            {/* Balance Inputs */}
            {Object.keys(formData.balance).map((coin) => (
              <div key={coin} className="flex flex-col mb-4">
                <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                  {coin.charAt(0).toUpperCase() + coin.slice(1)}
                </label>
                <Input
                  type="number"
                  name={`balance.${coin}`}
                  value={formData.balance[coin as keyof Balance].toString()}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={`Enter ${coin}`}
                />
              </div>
            ))}
                  {/* Balance id */}
            <div className="flex flex-col mb-4">
              <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Balance ID
              </label>
              <Input
                type="text"
                name="balance_id"
                value={formData.balance_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter status"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col mb-4">
              <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Status
              </label>
              <Input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter status"
              />
            </div>

            {/* USDT Total */}
            <div className="flex flex-col mb-4">
              <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                USDT Total
              </label>
              <Input
                type="number"
                name="usdt_total"
                value={formData.usdt_total.toString()}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter USDT Total"
              />
            </div>

            {/* Unpaid Amount */}
            <div className="flex flex-col mb-4">
              <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Unpaid Amount
              </label>
              <Input
                type="number"
                name="unpaid_amount"
                value={formData.unpaid_amount.toString()}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter unpaid amount"
              />
            </div>

            {/* Deposit Wallet */}
            <div className="flex flex-col mb-4">
              <label className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                Deposit Wallet
              </label>
              <Input
                type="text"
                name="deposit_wallet"
                value={formData.deposit_wallet}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter deposit wallet"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400"
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="px-4 py-3 font-normal text-gray-500 text-theme-sm dark:text-gray-400"
              size="sm"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditModal;
