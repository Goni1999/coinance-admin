"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";
const Pending = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
const t = useTranslations();
  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) {
      setIsAuthenticated(false);
      router.push("/signin");
      return;
    }

    const checkUserRole = async () => {
      try {
        const { data } = await axios.get("https://server.coinance.co/api/check-user-role-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.role === "user") {
          localStorage.removeItem("kycSubmitted"); // Clean kycSubmitted
          router.push("/");
        } else if (data.role === "emailVerified") {
          localStorage.removeItem("kycSubmitted"); // Clean kycSubmitted
          router.push("/kyc_verification");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/signin");
      }
    };

    checkUserRole(); // Check role immediately on mount

    const interval = setInterval(() => {
      checkUserRole();
    }, 10000); // Check role every 2 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering if not authenticated
  }

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
        <div className="mb-5 sm:mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          {t("requestpending")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("pendingp1")}
          </p>
        </div>

        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-500 dark:text-gray-400 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
            ></path>
          </svg>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
          {t("needhelp")}{" "}
            <Link className="text-brand-500 hover:text-brand-600 dark:text-brand-400" href="https://www.coinance.co/support">
            {t("contactsupport")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pending;
