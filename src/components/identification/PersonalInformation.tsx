"use client";
import React, { useState, useEffect } from "react";

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
      'city' in userData && 
      'state' in userData && 
      'identification_documents_type' in userData && 
      'card_id' in userData && 
      'email' in userData
    ) {
      // Now we can safely access the properties
      const { first_name, last_name, date_of_birth, city, state, identification_documents_type, card_id, email } = userData as {
        first_name: string;
        last_name: string;
        date_of_birth: string;
        city: string;
        state: string;
        identification_documents_type: string;
        card_id: string;
        email: string;
      };
  
      return {
        name: first_name || "User",
        lastname: last_name || "",
        dob: formatDate(date_of_birth) || "01.01.2000",
        city: city || "Not provided",
        state: state || "Not provided",
        idtype: identification_documents_type || "N/A",
        idnumber: card_id || "N/A",
        email: maskEmail(email) || "user@example.com",
      };
    } else {
      // Return default values if userData doesn't match the expected structure
      return {
        name: "User",
        lastname: "",
        dob: "01.01.2000",
        city: "Not provided",
        state: "Not provided",
        idtype: "N/A",
        idnumber: "N/A",
        email: "user@example.com",
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
  
  // Example usage
  
  // Example usage
  
  // ✅ Function to mask email (e.g., a**1@gmail.com)
  const maskEmail = (email: string): string => {
    if (!email.includes("@")) return email; // Invalid email handling
    const [localPart, domain] = email.split("@");
    if (localPart.length < 3) return email; // Short emails won't be masked
    return `${localPart[0]}**${localPart[localPart.length - 1]}@${domain}`;
  };
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
