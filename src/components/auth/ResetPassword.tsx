"use client";  // Mark this component as client-side

import Link from "next/link";
import React, { useState } from "react"; 
import { useSearchParams } from "next/navigation";  // For getting token from the URL
import { useTranslations } from "next-intl";
const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");  // Get token from query params
 const t = useTranslations();
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://server.capital-trust.eu/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          href="/"
        >
          <svg
            className="stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("back")}
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          {t("resetyourpassword")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("enteryourpasswordbelow")}
          </p>
        </div>

        {success ? (
          <div className="p-4 mb-5 text-sm text-green-600 bg-green-100 border border-green-400 rounded-lg">
            {t("passwordresetsuccessfully")}{" "}
            <Link href="/signin" className="text-brand-500 hover:text-brand-600">
            {t("loginpass")}
            </Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {t("newpass")}<span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {t("confirmpass")}<span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"
                  }`}
                >
                  {loading ? `${t("resetting...")}`  : `${t("resetpass")}`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
