"use client";
import React from "react";
import  { useState, useEffect } from "react";

import Image from "next/image";
import Badge from "../ui/badge/Badge";

export default function UserVerification() {
   const [user, setUser] = useState<{
     id: string;
   
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
     // ✅ Function to format date and mask email
     const formatUserData = (userData: unknown) => {
      // Type guard to ensure userData has an 'id' property
      if (typeof userData === 'object' && userData !== null && 'id' in userData) {
        const { id } = userData as { id: string }; // Type assertion after the check
        return {
          id: id || "ID",
        };
      } else {
        return {
          id: "ID", // Default value if the check fails
        };
      }
    };
    
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user/owner1.png"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                User-{user?.id}
              </h4>
              <div className="flex flex-row items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user?.id}
                </p>
                <Badge color="success">
            
            Verified
          </Badge>
              
              </div>
            </div>
           
          </div>
          
        </div>
      </div>
      
    </>
  );
}
