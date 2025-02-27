"use client";
import React from "react";
import { useState, useEffect } from "react";

export default function PersonalInformation() {
 const [user, setUser] = useState<{
    name: string;
    lastname: string;
    dob: string;
    city: string;
    state: string;
    idtype: string;
    idnumber: string;
    email: string;
  } | null>(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("auth-token"); // Get JWT token from localStorage
        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        const response = await fetch("https://server.capital-trust.eu/api/get-user-data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        setUser({
          name: data.first_name || "User",
          lastname: data.last_name || "",
          dob: data.date_of_birth || "2000-01-01", // Default Date of Birth
          city: data.city || "Not provided", // Default Address
          state: data.state || "Not provided", // Default Address
          idtype: data.identification_documents_type || "Not provided", // Default Address
          idnumber: data.card_id || "ID Card, ID**********23", // Default Identification
          email: data.email || "user@example.com",
        });
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information

            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4 ">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Legal Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user ? `${user.name} ${user.lastname}` : "User"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of Birth
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.dob || "1901-10-01"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user ? `${user.city}, ${user.state}` : "Not provided"}
                    </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Identification Documents

                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user ? `${user.idtype}, ${user.idnumber}` : "ID Card, ID**********23"}

                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "user@example.com"}


                </p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
     
    </>
  );
}
