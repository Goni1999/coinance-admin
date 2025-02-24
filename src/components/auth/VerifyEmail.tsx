"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VerifyEmail = () => {
  const [email, ] = useState<string>(""); // Set email dynamically if needed
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
  const router = useRouter();

  // Function to check email verification from the database
  const checkEmailVerification = async () => {
    if (!email) return;
    try {
      const response = await axios.get(`https://server.capital-trust.eu/api/check-email?email=${email}`);

      // Assuming API response contains user role information
      setIsVerified(response.data.role === "emailverified");
    } catch (error) {
      console.error("Error checking email verification:", error);
      setIsVerified(false);
    }
  };

  // Automatically check email verification every 30 seconds
  useEffect(() => {
    if (!email) return;

    checkEmailVerification(); // Initial check

    const interval = setInterval(checkEmailVerification, 30000); // Re-check every 30 seconds

    return () => clearInterval(interval);
  }, [email]);

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!email) return;
    setIsResending(true);
    setMessage("");
    try {
      await axios.post("https://server.capital-trust.eu/api/resend-verification", { email });
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Failed to resend verification email. Try again later.");
      console.error("Error resending verification email:", error);
    }
    setIsResending(false);
  };

  // Redirect to Two-Step Verification if verified
  const handleContinue = () => {
    if (isVerified) {
      router.push("/twostepverification");
    }
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isVerified ? (
        // When email is verified
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Your email is Verified!</h1>
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      ) : (
        // When email is NOT verified
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Your email is not verified</h1>
          <p className="text-sm text-gray-500">Please check your inbox for the verification email.</p>

          {/* Disabled Continue Button */}
          <button
            className="mt-4 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
            disabled
          >
            Continue
          </button>

          {/* Resend Verification Email Button */}
          <button
            className="mt-3 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            onClick={resendVerificationEmail}
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend Verification Email"}
          </button>

          {/* Display Message (Success/Error) */}
          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
