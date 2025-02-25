"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

const TwoStepVerification = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // ✅ Check if user has auth-token
      const authToken = Cookies.get("auth-token");
      if (!authToken) {
        router.push("/signin"); // Redirect to login if no token
        return;
      }

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        router.push("/signin"); // Redirect if email not found
        return;
      }

      const hasCompletedVerification = sessionStorage.getItem("twoStepVerified");
      if (hasCompletedVerification) {
        router.push("/"); // Redirect to main page if already verified
        return;
      }

      try {
        // ✅ Check OTP verification status from server
        const { data } = await axios.get("https://server.capital-trust.eu/api/check-otp-status", {
          params: { email: userEmail },
          withCredentials: true, // ✅ Include auth-token cookie in request
        });

        if (data.verified) {
          sessionStorage.setItem("twoStepVerified", "true");
          router.push("/");
        } else {
          sendOTP(); // If not verified, send OTP
        }
      } catch (error) {
        console.error("Error checking OTP status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  // ✅ Send OTP API Call
  const sendOTP = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      await axios.post(
        "https://server.capital-trust.eu/api/send-otp",
        { email: userEmail },
        { withCredentials: true } // ✅ Ensure request includes cookies
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // ✅ Handle OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOtp(otpCopy);

    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  // ✅ Verify OTP API Call
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const enteredOtp = otp.join("");

    try {
      const response = await axios.post(
        "https://server.capital-trust.eu/api/verify-otp",
        { email: userEmail, otp: enteredOtp },
        { withCredentials: true } // ✅ Ensure request includes cookies
      );

      if (response.data.message === "OTP verified successfully") {
        sessionStorage.setItem("twoStepVerified", "true");
        router.push("/"); // Redirect to dashboard
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Try again.");
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
          <svg className="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            A verification code has been sent to your email. Please enter it below.
          </p>
        </div>

        <form onSubmit={verifyOtp}>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter your 6-digit security code
              </label>
              <div className="flex gap-2 sm:gap-4">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={value}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="otp-input h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-center text-xl font-semibold text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify My Account"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Didn’t get the code?{" "}
            <button
              type="button"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              onClick={sendOTP}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoStepVerification;
