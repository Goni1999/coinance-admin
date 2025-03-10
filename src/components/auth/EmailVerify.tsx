"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";
const EmailVerify = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
const t = useTranslations();
  useEffect(() => {
    // Get token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    const EmailVerify = async () => {
      try {
        // Send token to the backend for verification
        const response = await axios.post("https://server.capital-trust.eu/auth/verify-email-admin", { token });

        if (response.data.success) {
          setMessage("Your email has been successfully verified!");
          setTimeout(() => {
            router.push("/twostepverification"); // Redirect after 3 seconds
          }, 3000);
        } else {
          setError("Email verification failed. Please try again.");
        }
      } catch  {
        setError("An error occurred while verifying the email. Please try again later.",);
      } finally {
        setLoading(false);
      }
    };

    EmailVerify();
  }, [router]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

    <div className="flex flex-col items-center justify-center h-screen text-center">
      {loading && <p className="text-lg text-gray-700">{t("verifyingemail")}</p>}

      {error && <p className="text-lg text-red-500">{error}</p>}
      {message && <p className="text-lg text-green-500">{message}</p>}
    </div>
    </div>
  );
};

export default EmailVerify;
