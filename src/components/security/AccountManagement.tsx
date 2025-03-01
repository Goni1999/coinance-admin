'use client';
import React, { useState } from "react";
import Alert from "../ui/alert/Alert";
const AccountManagement: React.FC = () => {
  const [alert, setAlert] = useState({
    variant: "success" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
    show: false,
  });


 
  
  const handleRequest = async (action: "disable" | "delete") => {
    try {
      const userEmail = sessionStorage.getItem("userEmail"); // Retrieve unmasked email

      if (!userEmail) {
        setAlert({
          variant: "error",
          title: "No User Found",
          message: "User email is missing.",
          show: true,
        });
        return;
      }

      const response = await fetch("https://server.capital-trust.eu/api/request-account-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request.");
      }

      setAlert({
        variant: "success",
        title: `Request to ${action} account sent successfully`,
        message: `Please check your email for further instructions.`,
        show: true,
      });
    } catch {
      setAlert({
        variant: "error",
        title: `Failed to ${action} account`,
        message: "Please refresh the page and try again later.",
        show: true,
      });
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Account Management
          </h4>

          {/* Disable Account Section */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex flex-col justify-start gap-4">
                <div className="flex flex-row gap-4">
                  <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
                    Disable Account
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Once disabled, your actions will be restricted. You can unblock anytime. This will not delete your account.
                </p>
              </div>
              <button
                onClick={() => handleRequest("disable")}
                className="text-gray-700 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                Request
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex flex-col justify-start gap-4">
                <div className="flex flex-row gap-4">
                  <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
                    Delete Account
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  This action is irreversible. Once deleted, you cannot recover your account or transaction history.
                </p>
              </div>
              <button
                onClick={() => handleRequest("delete")}
                className="text-gray-700 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                Request
              </button>
            </div>
          </div>

          {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <br/>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
