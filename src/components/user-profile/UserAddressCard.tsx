"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';


export default function UserAddressCard() {
  const [user, setUser] = useState<{
      address: string;
      city: string;
      state: string;
      zip_code: string;
   
    } | null>(null);
    const t = useTranslations();

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
      // Type guard: Ensure userData has all the necessary properties
      if (
        typeof userData === 'object' && 
        userData !== null && 
        'address' in userData && 
        'city' in userData && 
        'state' in userData && 
        'zip_code' in userData
       
      ) {
        // Now we can safely access the properties
        const { address, city, state, zip_code } = userData as {
          address: string;
          city: string;
          state: string;
          zip_code: string;
         
        };
    
        return {
          address: address || "address",
          city: city || "city",
          state: state || "Not provided",
          zip_code: zip_code || "zip_code",
        };
      } else {
        // Return default values if userData doesn't match the expected structure
        return {
          address: "address",
          city: "city",
          state: "state",
          zip_code: "zip_code",
         
        };
      }
    };
    
 
    
    

 
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
             {t("userpr1")} 
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userpr1")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.address || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userpr2")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user ? `${user.city}, ${user.state}` : "City, State"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userpr3")}  
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.zip_code || "N/A"}

                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userpr4")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.state || "N/A"}

                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      {/*
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input type="text" defaultValue="United States" value={""} />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" defaultValue="Arizona, United States." value={""} />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" defaultValue="ERT 2489" value={""} />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input type="text" defaultValue="AS4568384" value={""} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>*/}
    </>
  );
}
