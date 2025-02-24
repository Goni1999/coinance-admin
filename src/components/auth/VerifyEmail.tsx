"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for routing in Next.js 13+
import axios from "axios";

const VerifyEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter(); // Initialize Next.js router

  // Function to check if the email is verified
  const checkEmailVerification = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/check-email", { email });
      setIsVerified(response.data.verified);
    } catch (error) {
      setIsVerified(false);
      console.error("Error checking email verification:", error);
    }
    setLoading(false);
  };

  // Automatically check email verification every 1 minute
  useEffect(() => {
    if (!email) return;

    // Initial check when email is entered
    checkEmailVerification();

    // Set up interval to check every 1 minute (60,000 ms)
    const interval = setInterval(checkEmailVerification, 60000);

    // Cleanup interval when email changes or component unmounts
    return () => clearInterval(interval);
  }, [email]);

  // Function to resend the verification email
  const resendVerificationEmail = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await axios.post("/api/resend-verification", { email });
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Failed to send verification email. Try again later.");
      console.error("Error resending verification email:", error);
    }
    setLoading(false);
  };

  // Redirect to Two-Step Verification page if verified
  const handleContinue = () => {
    if (isVerified) {
      router.push("/twostepverification"); // Redirect user to 2-step verification page
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
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please enter your email to check if it is verified. If not, you can resend the verification email.
          </p>
        </div>

        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email<span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isVerified !== null && (
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  {isVerified ? (
                    <span className="text-green-500">✅ Your email is verified. You can continue.</span>
                  ) : (
                    <span className="text-red-500">⚠️ Your email is not verified.</span>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {/* Continue Button */}
                <button
                  className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition shadow-theme-xs ${
                    isVerified
                      ? "bg-brand-500 hover:bg-brand-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isVerified}
                  onClick={handleContinue}
                >
                  Continue
                </button>

                {/* Resend Verification Email Button */}
                <button
                  type="button"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600"
                  onClick={resendVerificationEmail}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Resend Verification Email"}
                </button>

                {/* Display Message (Success or Error) */}
                {message && (
                  <p className="text-sm text-center text-gray-700 dark:text-gray-400">{message}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
