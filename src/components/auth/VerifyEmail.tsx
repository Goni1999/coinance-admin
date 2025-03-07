"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Alert from "../ui/alert/Alert";
import { useTranslations } from "next-intl";
const VerifyEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
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
  const t = useTranslations();
  // Load email from sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
      if (!token) {
        router.push("/signin");
        return;
      }
      
    const storedEmail = sessionStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);
 
  // Check email verification
  const checkEmailVerification = async () => {
    if (!email) return;
    try {
      const response = await axios.get(
        `https://server.capital-trust.eu/api/check-email?email=${email}`
      );
      setIsVerified(response.data.role !== "unverified");
    } catch (error) {
      console.error("Error checking email verification:", error);
      setIsVerified(false);
    }
  };

  // Auto check verification every 30 sec
  useEffect(() => {
    if (!email) return;
    checkEmailVerification();
    const interval = setInterval(checkEmailVerification, 30000);
    return () => clearInterval(interval);
  }, [email]);

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (!email) return;
    setIsResending(true);
    setMessage("");
    try {
      await axios.post("https://server.capital-trust.eu/api/resend-verification", { email });
      setMessage("Verification email sent! Please check your inbox.");
      setAlert({
        variant: "success",
        title: "Verification email sent!",
        message: "Please check your inbox.",
        show: true
      }); 
    } catch (error) {
      setMessage("Failed to resend verification email. Try again later.");
      console.error("Error resending verification email:", error);
    }
    setIsResending(false);
  };

  // Redirect if verified
  const handleContinue = () => {
    if (isVerified) router.push("/twostepverification");
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12 text-center">
    {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <br/>
      {isVerified ? (
        // ✅ When email is verified
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-green-600 md:text-3xl">{t("continuep3")}</h1>
          <button
            className="mt-4 w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            onClick={handleContinue}
          >
           {t("continue")} 
          </button>
        </div>
      ) : (
        // ❌ When email is NOT verified
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-red-600 md:text-2xl">{t("continuep1")}</h1>
          <p className="text-sm text-gray-500 mt-2">{t("continuep2")}</p>

          {/* Disabled Continue Button */}
          <button
            className="mt-4 w-full px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
            disabled
          >
           {t("continue")}
          </button>

          {/* Resend Verification Email Button */}
          <button
            className="mt-3 w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            onClick={resendVerificationEmail}
            disabled={isResending}
          >
            {isResending ? `${t("resending")}` : `${t("resendemailv")}`}
          </button>

          {/* Display Message (Success/Error) */}
          {message && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{message}</p>}
        </div>
      )}
    </div>
    </div>
  );
};

export default VerifyEmail;
