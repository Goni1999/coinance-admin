"use client";

import React, { useState, useEffect } from "react";

const Referral = () => {
  // State to handle copying the referral link
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve token from sessionStorage
        const token = sessionStorage.getItem("auth-token");
        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        // Try to get user data from sessionStorage
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
          // If user data is already stored, parse and set it
          const parsedUser = JSON.parse(storedUser);
          setUser(formatUserData(parsedUser));
          return; // Skip the fetch if user data is already in sessionStorage
        }

        // If no user data found, fetch from API
        const response = await fetch("https://server.capital-trust.eu/api/get-user-data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const userData = await response.json(); // Backend returns user directly

        // Store the fetched user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Update state with formatted data
        setUser(formatUserData(userData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to format user data
  const formatUserData = (userData: unknown) => {
    if (typeof userData === "object" && userData !== null && "id" in userData) {
      const { id } = userData as { id: string }; // Type assertion after the check
      return {
        id: id || "ID", // Return formatted user data with id
      };
    } else {
      return {
        id: "ID", // Default value if the check fails
      };
    }
  };

  // Function to copy the referral link to clipboard
  const copyToClipboard = () => {
    const referralLink = `https://www.dashboar.capital-trust.eu/CPA_${user?.id}001QNLQ8NZ`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <div className="flex flex-col lg:flex lg:flex-row justify-between p-5 gap-5 lg:gap-10">
      {/* Left Side */}
      <div className="w-full lg:w-[2/3]">
        <h2 className="text-3xl text-gray-500 dark:text-gray-400 font-semibold leading-snug md:text-5xl lg:text-6xl">
          Refer Friends.
          <br />
          Get 100 USD Equivalent Trading Fee Credit Each.
        </h2>
      </div>
      <br />
      {/* Right Side (Form) */}
      <div className="w-full lg:w-[1/3] border border-gray-300 rounded-lg p-5">
        <div className="mb-5">
          {/* Referral ID */}
          <div className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-2">Referral ID</div>
          <input
            type="text"
            value={`CPA_${user?.id}001QNLQ8NZ`}
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly
          />
        </div>

        <div className="mb-5">
          {/* Referral Link */}
          <div className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-2">Referral Link</div>
          <input
            type="text"
            value={`https://www.dashboar.capital-trust.eu/CPA_${user?.id}001QNLQ8NZ`}
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly
          />
        </div>

        {/* Invite Button */}
        <button
          onClick={copyToClipboard}
          className="w-full py-3 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          {copied ? "Link Copied!" : "Invite Friends"}
        </button>
      </div>
    </div>
  );
};

export default Referral;
