'use client';

import React, { useState } from "react";

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
  balanceId: string;  // Add balance_id to pass as prop
  balance: Balance;
  status: string;  // Add status
  usdtTotal: number;  // Add usdt_total
  unpaidAmount: number;  // Add unpaid_amount
  depositWallet: string;  // Add deposit_wallet
  onSubmit: (updatedData: { balance_id: string; user_id: string; balance: Balance; status: string; usdt_total: number; unpaid_amount: number;  deposit_wallet: string }) => void;
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
  onSubmit
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('balance.')) {
      const coin = name.split('.')[1] as keyof Balance;
      setFormData((prev) => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: parseFloat(value) || 0, // Parse to float for the balance
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Handle other fields
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Balance</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>Balance</h3>
          {Object.keys(formData.balance).map((coin) => (
            <div key={coin}>
              <label htmlFor={coin}>{coin.charAt(0).toUpperCase() + coin.slice(1)}</label>
              <input
                type="number"
                id={coin}
                name={`balance.${coin}`}
                value={formData.balance[coin as keyof Balance]}
                onChange={handleChange}
              />
            </div>
          ))}
          
          <h3>Status</h3>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
          
          <h3>USDT Total</h3>
          <input
            type="number"
            name="usdt_total"
            value={formData.usdt_total}
            onChange={handleChange}
          />
          
          <h3>Unpaid Amount</h3>
          <input
            type="number"
            name="unpaid_amount"
            value={formData.unpaid_amount}
            onChange={handleChange}
          />
          
          
          
          <h3>Deposit Wallet</h3>
          <input
            type="text"
            name="deposit_wallet"
            value={formData.deposit_wallet}
            onChange={handleChange}
          />
          
          <button type="button" onClick={handleSubmit}>Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
