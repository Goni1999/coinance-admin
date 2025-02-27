"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Alert from "../ui/alert/Alert";
const TwoStepVerification = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  useEffect(() => {
    const checkAuthStatus = async () => {

      const token = sessionStorage.getItem("auth-token");
      if (!token) {
        router.push("/signin");
        return;
      }
  
      const hasCompletedVerification = sessionStorage.getItem("twoStepVerified");
      if (hasCompletedVerification) {
        try {
          // Fetch latest user role from backend
          const { data } = await axios.get("https://server.capital-trust.eu/api/check-user-role", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (data.role === "pending") {
            router.push("/pending");
          } else if (data.role === "emailverified") {
            router.push("/kyc_verification");
          } else if (data.role === "user"){
            router.push("/");
          } else {
            router.push("/signin");
          }
          return;
        } catch (error) {
          console.error("Error fetching user role:", error);
          router.push("/signin");
          return;
        }
      }
  
      try {
        const { data } = await axios.get("https://server.capital-trust.eu/api/check-otp-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (data.verified) {
          sessionStorage.setItem("twoStepVerified", "true");
  
          try {
            // Fetch latest user role from backend
            const { data } = await axios.get("https://server.capital-trust.eu/api/check-user-role", {
              headers: { Authorization: `Bearer ${token}` },
            });
  
            if (data.role === "pending") {
              router.push("/pending");
            } else if (data.role === "emailverified") {
              router.push("/kyc_verification");
            } else if (data.role === "user"){
              router.push("/");
            }else {
              router.push("/signin");
            }
            return;
          } catch (error) {
            console.error("Error fetching user role:", error);
            router.push("/signin");
            return;
          }
        } else {
          sendOTP(); // ✅ No need for `await` inside `useEffect`
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
      const token = sessionStorage.getItem("auth-token");
      if (!token) return console.error("No auth token found");
  
      const response = await axios.post(
        "https://server.capital-trust.eu/api/send-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("OTP sent response:", response.data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };
  
 // ✅ Handle OTP input
const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value;

  // Only allow numbers
  if (!/^\d*$/.test(value)) return;

  const otpCopy = [...otp];
  otpCopy[index] = value;
  setOtp(otpCopy);

  // Auto-focus next input field
  if (value !== "" && index < otp.length - 1) {
    document.getElementById(`otp-input-${index + 1}`)?.focus();
  }
};

// ✅ Handle OTP deletion (delete all when pressing backspace on the first empty field)
const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  if (e.key === "Backspace") {
    const otpCopy = [...otp];

    if (otpCopy[index] === "" && index > 0) {
      // Move focus to the previous input
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }

    otpCopy[index] = "";
    setOtp(otpCopy);
  }
};

// ✅ Clear OTP on incorrect input
const clearOtp = () => {
  setOtp(Array(otp.length).fill(""));
  document.getElementById("otp-input-0")?.focus();
};

// ✅ Verify OTP API Call (Role-Based Redirection)
const verifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const token = sessionStorage.getItem("auth-token");
  if (!token) return;

  const enteredOtp = otp.join("");

  try {
    const response = await axios.post(
      "https://server.capital-trust.eu/api/verify-otp",
      { otp: enteredOtp }, // No email needed, backend extracts from token
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.message === "true") {
      sessionStorage.setItem("twoStepVerified", "true");
      setAlert({
        variant: "success",
        title: "2FA verified successfully",
        message: "",
        show: true
      });
      try {
        // Fetch latest user role from backend
        const { data } = await axios.get("https://server.capital-trust.eu/api/check-user-role", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.role === "pending") {
          router.push("/pending");
        } else if (data.role === "emailverified") {
          router.push("/kyc_verification");
        } else {
          router.push("/");
        }
        return;
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/signin");
        return;
      }
    } else {
      setError(response.data.message);
      clearOtp ();
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
      {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <br/>
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
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
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
