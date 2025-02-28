'use client';
import React, { useState, useEffect } from "react";

const TwoFactor: React.FC = () => {
  const [, setMessage] = useState("");
 const [user, setUser] = useState<{
     email: string;
     phone: string;

   } | null>(null);

    
      useEffect(() => {
        // ✅ Try to load user data from sessionStorage first
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(formatUserData(parsedUser));
          return; // ✅ Skip API call if data is already in sessionStorage
        }
    
        // ✅ If no user data found, fetch from API
        const fetchUserData = async () => {
          try {
            const token = sessionStorage.getItem("auth-token");
            if (!token) {
              console.error("No token found, user not authenticated.");
              return;
            }
    
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
    
            // ✅ Store in sessionStorage
            sessionStorage.setItem("user", JSON.stringify(userData));
    
            // ✅ Update state with formatted data
            setUser(formatUserData(userData));
    
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUserData();
      }, []);

      const formatUserData = (userData: unknown) => {
        // Type Guard: Ensure userData has 'email' and 'phone' properties
        if (typeof userData === 'object' && userData !== null && 'email' in userData && 'phone' in userData) {
          const { email, phone } = userData as { email: string; phone: string };
          return {
            email: maskEmail(email) || "email",  // Safely access email
            phone: phone || "phone",  // Safely access phone
          };
        } else {
          return {
            email: "email",  // Default value
            phone: "phone",  // Default value
          };
        }
      };
      

       // ✅ Function to mask email (e.g., a**1@gmail.com)
  const maskEmail = (email: string): string => {
    if (!email.includes("@")) return email; // Invalid email handling
    const [localPart, domain] = email.split("@");
    if (localPart.length < 3) return email; // Short emails won't be masked
    return `${localPart[0]}*****${localPart[localPart.length - 1]}@${domain}`;
  };


  const handleRequestReset = async () => {
    try {
      const userEmail = sessionStorage.getItem("userEmail"); // Retrieve unmasked email

      const jsonBody = JSON.stringify({ email: userEmail });
      const response = await fetch("https://server.capital-trust.eu/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody,
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Failed to request reset.");
    }
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Two-Factor Authentication (2FA)
          </h4>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <svg
                className="bn-svg !text-[24px]"
                width="30" height="30"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z"
                  fill="#98A2B3"
                ></path>
              </svg>
              <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
                To increase your account security, it is recommended to enable 2FA, using your email to provide code.
              </p>
            </div>
            <a
              href="##"
              className="text-md text-gray-500 dark:text-gray-400"
            >
              By default is enabled 2FA using your email
            </a>
          </div>

          

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <svg
                              width="30" height="30"

                className="bn-svg !text-[20px]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.5 5h-18v14.4h18V5zm-18 2.7l9 5.728 9-5.728v3.2l-9 5.728-9-5.727V7.7z"
                  fill="#98A2B3"
                ></path>
              </svg>
              <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Use your email to protect your account and transactions.
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-800 dark:text-white/90">
              {user?.email || "user@example.com"}
              </div>
              
            </div>
          </div>
            <br/>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <svg
                              width="30" height="30"

                className="bn-svg !text-[20px]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.998 10.96A8 8 0 0013 3.006h-.032l.016 2.22H13a5.777 5.777 0 015.777 5.75l2.222-.018zm3.508.031a4.43 4.43 0 00-1.33-3.124 4.43 4.43 0 00-3.166-1.273l.017 2.221a2.215 2.215 0 011.592.637c.435.428.657.991.665 1.557l2.222-.018zm-2.509 6.608v-3.6H14.22l-1.627 1.409a13.673 13.673 0 01-4.002-4.003l1.407-1.628V4H4C4 12.836 11.163 20 19.999 20v-2.4z"
                  fill="#98A2B3"
                ></path>
              </svg>
              <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
                Phone Number
              </p>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Use your phone number to protect your account and transactions.
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-800 dark:text-white/90">
              {user?.phone || "user@example.com"}
              </div>
              
            </div>
          </div>
          <br/>

          <div className="mb-6">
  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
    <div className="flex flex-col  justify-start gap-4">
<div className="flex flex-row gap-4 ">
      <svg
        width="30"
        height="30"
        className="bn-svg !text-[20px]"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 6h22v12H1V6zm20 2h-2v8h2V8zM6.5 12a2 2 0 10-4 0 2 2 0 004 0zm5.5 0a2 2 0 10-4 0 2 2 0 004 0zm5.5 0a2 2 0 10-4 0 2 2 0 004 0z"
          fill="#98A2B3"
        ></path>
      </svg>
      <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
        Login Password
      </p>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        Login password is used to log in to your account.
      </p>
    </div>
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
      <button onClick={handleRequestReset} className="bg-blue-500 text-white inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
        Reset Password
      </button>
    </div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default TwoFactor;
