'use client';

import Link from "next/link";
import React, { useState } from "react";

const TwoStepVerification = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOtp(otpCopy);

    if (value !== "" && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
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
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Two Step Verification
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A verification code has been sent to your mobile. Please enter it in the field below.
          </p>
        </div>

        <div>
          <form>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Type your 6 digits security code
                </label>
                <div className="flex gap-2 sm:gap-4" id="otp-container">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      value={value}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(e, index)}
                      className="dark:bg-dark-900 otp-input h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-center text-xl font-semibold text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  ))}
                </div>
              </div>

              <div>
                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                  Verify My Account
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Didn’t get the code?{" "}
              <Link className="text-brand-500 hover:text-brand-600 dark:text-brand-400" href="/">
                Resend
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoStepVerification;
