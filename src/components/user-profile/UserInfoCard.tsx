"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';


export default function UserInfoCard() {
  const [user, setUser] = useState<{
      name: string;
      lastname: string;
      dob: string;
      position: string;
      email: string;
      phone: string;
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
        'first_name' in userData && 
        'last_name' in userData && 
        'date_of_birth' in userData && 
        'position' in userData && 
        'email' in userData && 
        'phone' in userData
      ) {
        // Now we can safely access the properties
        const { first_name, last_name, date_of_birth, position, email, phone } = userData as {
          first_name: string;
          last_name: string;
          date_of_birth: string;
          position: string;
          email: string;
          phone: string;
        };
    
        return {
          name: first_name || "User",
          lastname: last_name || "",
          dob: formatDate(date_of_birth) || "01.01.2000",
          position: position || "Not provided",
          email: email || "user@example.com",
          phone: phone || "01 234 567",
        };
      } else {
        // Return default values if userData doesn't match the expected structure
        return {
          name: "User",
          lastname: "",
          dob: "01.01.2000",
          position: "Not provided",
          email: "user@example.com",
          phone: "N/A",
        };
      }
    };
    
    const formatDate = (dateString: string): string => {
      if (!dateString) return "01.01.2000"; // Default date
    
      const date = new Date(dateString); // Convert to Date object
    
      // Extract day, month, and year
      const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure two digits
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() is zero-based
      const year = date.getUTCFullYear();
    
      return `${day}.${month}.${year}`;
    };
    
    
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          {t("userpr5")} 
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr6")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr7")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.lastname || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr8")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr9")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.phone || "N/A"}

              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr10")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.dob || "N/A"}

              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userpr11")}  
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user?.position || "N/A"}

              </p>
            </div>

          </div>
        </div>

        
      </div>
{/*
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.facebook.com/PimjoHQ" value={""}                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" defaultValue="https://x.com/PimjoHQ" value={""} />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.linkedin.com/company/pimjo" value={""}                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      defaultValue="https://instagram.com/PimjoHQ" value={""}                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" defaultValue="Musharof" value={""} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" defaultValue="Chowdhury" value={""} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" defaultValue="randomuser@pimjo.com" value={""} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" defaultValue="+09 363 398 46" value={""} />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue="Team Manager" value={""} />
                  </div>
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
    </div>
  );
}
