"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function PersonalInformation() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Account Limits

            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-12 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Fiat Deposit & Withdrawal Limits
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                100K USD Daily
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Crypto Deposit Limit
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Unlimited
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Crypto Withdrawal Limit
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                10M USDT Daily
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                P2P Transaction Limits
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Unlimited
                </p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
     
    </>
  );
}
