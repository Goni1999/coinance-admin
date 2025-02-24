"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VerifyEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  // Function to check email verification from the database
  const checkEmailVerification = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post("https://server.capital-trust.eu/api/check-email", { email });

      // Assuming API response contains user role information
      setIsVerified(response.data.role === "emailVerified");
    } catch (error) {
      setIsVerified(false);
      console.error("Error checking email verification:", error);
    }
    setLoading(false);
  };

  // Automatically check email verification every 1 minute
  useEffect(() => {
    if (!email) return;

    checkEmailVerification(); // Initial check

    const interval = setInterval(checkEmailVerification, 60000); // Re-check every 1 min

    return () => clearInterval(interval);
  }, [email]);

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await axios.post("https://server.capital-trust.eu/api/resend-verification", { email });
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Failed to send verification email. Try again later.");
      console.error("Error resending verification email:", error);
    }
    setLoading(false);
  };

  // Redirect to Two-Step Verification if verified
  const handleContinue = () => {
    if (isVerified) {
      router.push("/twostepverification");
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
              stroke="currentColor"
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
            {isVerified ? "Your email is verified" : "Your email is not verified"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isVerified
              ? "You can now continue to the next step."
              : "Please check your inbox to verify your email. If you didn't receive the link, resend the verification email."}
          </p>
        </div>

        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
