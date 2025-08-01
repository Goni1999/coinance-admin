"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
const CopyAddress = () => {
  const [copied, setCopied] = useState(false);
  const [balanceId, setBalanceId] = useState<string | null>(null);
const t = useTranslations();
  useEffect(() => {
    // Try to get balance_id from sessionStorage first
    const storedBalanceId = sessionStorage.getItem("balance_id");
    if (storedBalanceId) {
      setBalanceId(storedBalanceId);
      return; // Skip API call if already stored
    }

    // Fetch balance_id from API if not found in sessionStorage
    const fetchBalanceId = async () => {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        const response = await fetch(
          "https://server.coinance.co/api/wallet-admin",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data?.balance_id) {
          setBalanceId(data.balance_id);
          sessionStorage.setItem("balance_id", data.balance_id); // Save to sessionStorage
        } else {
          console.error("Balance ID not found in API response.");
        }
      } catch (error) {
        console.error("Error fetching balance ID:", error);
      }
    };

    fetchBalanceId();
  }, []);

  const copyToClipboard = () => {
    if (!balanceId) {
      console.error("Balance ID is not available.");
      return;
    }

    navigator.clipboard
      .writeText(balanceId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };
// to copy the referral link to clipboard


  return (
    <div className="flex flex-col lg:flex lg:flex-row justify-between p-5 gap-5 lg:gap-10">
      {/* Left Side */}
      <div className="w-full lg:w-[1/3]  rounded-lg p-5">
        <div className="mb-5">
          {/* Referral ID */}
          <h2 className="text-2xl text-gray-500 dark:text-gray-400 font-semibold leading-snug md:text-5xl lg:text-3xl">
        {t("depositcopyp1")}
        
          
        </h2>
        <br/>
          <p className=" text-gray-500 dark:text-gray-400 font-semibold leading-snug  ">
          {t("depositcopyp2")}
            </p>
        </div>

        <div className="mb-5">
          {/* Referral Link */}
          <div className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-2">{t("depositcopyp3")}</div>
          <input
            type="text"
            value={balanceId || `${t("depositcopyp4")}`}

            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly
          />
        </div>

        {/* Invite Button */}
        <button
          onClick={copyToClipboard}
          className="w-full py-3 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          {copied ? `${t("depositcopyp5")}`  :  `${t("depositcopyp6")}` }
        </button>
      </div>
    <br/>
      {/* Right Side (Form) */}
      <div className="w-full lg:w-[2/3]  rounded-lg p-5">
      <div className="video-container">
          <video className="deposit-video" autoPlay loop muted>
            <source src="/images/deposit/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        </div>
    </div>
  );
};

export default CopyAddress;
