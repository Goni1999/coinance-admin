"use client";

import Link from "next/link";
import React, { useState } from "react";
import Alert from "../ui/alert/Alert";
import { useTranslations } from "next-intl";
const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");  // State to store email input
  const [, setMessage] = useState("");  // Message state (not used right now but could be useful)
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    variant: "success",
    title: "",
    message: "",
    show: false,
  });
   const t = useTranslations();
  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle password reset request
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent form submission from reloading the page

    if (!email) {
      setAlert({
        variant: "error",
        title: "Email required",
        message: "Please provide your email address.",
        show: true,
      });
      return;
    }

    try {
      const jsonBody = JSON.stringify({ email });  // Use the email from state
      const response = await fetch("https://server.coinance.co/api/request-password-reset-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody,
      });

      if (!response.ok) {
        throw new Error("Failed to send reset request.");
      }

      const data = await response.json();
      setAlert({
        variant: "success",
        title: "Request password reset sent successfully",
        message: "Please check your inbox to reset your password.",
        show: true,
      });
      setMessage(data.message);
    } catch (error) {
      console.log(error)
      setAlert({
        variant: "error",
        title: "Failed to request reset password",
        message: "Please refresh the page and try again later!",
        show: true,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md pt-10 mx-auto">
        {alert.show && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            showLink={false}
          />
        )}
        <br />
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
              stroke=""
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
          {t("forgotpassword")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("resetpassform1")}
          </p>
        </div>

        <div>
          <form onSubmit={handleRequestReset}>  {/* Prevent default form submission */}
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {t("resetpassformemail")}<span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}  // Bind email state to input
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"  // Make sure this triggers the form submission
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  {t("resetpassformsendlink")} 
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            {t("resetpassformwait")}  {" "}
              <Link
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                href="/"
              >
                 {t("resetpassformclickhere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
