'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Alert from "../ui/alert/Alert";
import { useTranslations } from "next-intl";
const KYCConfirmation = () => {
  const router = useRouter();
  const [selectedIdType, setSelectedIdType] = useState<string>("");
  const [kyc, setKyc] = useState<boolean | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    frontId: null,
    backId: null,
    passportId: null,
    driversLicenseId: null,
  });
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    variant: "success",
    title: "",
    message: "",
    show: false,
  }); 
// ✅ Run fetchUserData when the component mounts
useEffect(() => {
    const token = sessionStorage.getItem("auth-token");

    if (!token) {
      setIsAuthenticated(false);
      router.push("/signin");
      return;
    }
    fetchUserData();
  }, []);
    

  const fetchUserData = async () => {
    const token = sessionStorage.getItem("auth-token");
  
    if (!token) {
      setIsAuthenticated(false);
      router.push("/signin");
      return;
    }
  
    try {
      const response = await fetch("https://server.capital-trust.eu/api/get-user-data-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      setKyc(data.kyc_verification); // ✅ Update KYC state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  
  // ✅ Run role check ONLY after KYC state is updated
  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    if (token && kyc !== null) {
      checkUserRole(token);
    }
  }, [kyc]); // 🔥 Runs when `kyc` updates

  const checkUserRole = async (token: string) => {
    try {
      const { data } = await axios.get("https://server.capital-trust.eu/api/check-user-role-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (kyc) {
        // ✅ Redirect based on role if KYC is verified
        if (data.role === "pending") {
          router.push("/pending");
        } else if (data.role === "user") {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      router.push("/signin");
    }
  };

  if (!isAuthenticated) {
    return null; // Prevent rendering if redirecting
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIdType(e.target.value);
  };

  const uploadToCloudinary = async (file: File) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uploads");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqysonzsh/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdType) {
        setAlert({
            variant: "error", // Red error alert
            title: "Missing ID Type",
            message: "Please select an ID type before submitting your documents.",
            show: true
          });
          
      return;
    }
  
    setLoading(true);
  
    try {
      const uploadedUrls: string[] = [];
      for (const key in files) {
        if (files[key]) {
          const url = await uploadToCloudinary(files[key] as File);
          if (url) uploadedUrls.push(url);
        }
      }
  
      const token = sessionStorage.getItem("auth-token");
      if (!token) {
        setAlert({
            variant: "error",
            title: "You are not authenticated",
            message: "Please login and upload again your documents!",
            show: true
          }); 
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      await axios.post(
        "https://server.capital-trust.eu/auth/save-kyc-admin",
        { urls: uploadedUrls, idType: selectedIdType },
        { headers }
      );
      setAlert({
        variant: "success",
        title: "KYC Verification Submitted Successfully!",
        message: "Wait until our team checks and approve your verification!",
        show: true
      }); 
  
      // ✅ Refresh user data to get the latest KYC and role state
      await fetchUserData(); // This updates the `kyc` state
  
      // ✅ Run role check AFTER KYC is updated
      checkUserRole(token);
    } catch (error) {
      console.error("Error during file upload:", error);
      setAlert({
        variant: "error",
        title: "Document Upload Failed",
        message: "Please check your documents and try again.",
        show: true
      }); 
  
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md pt-10 mx-auto">
      {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <br/>
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
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          {t("kycverification")} 
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("kycp")} 
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("kycselect")}<span className="text-error-500">*</span>
              </label>
              <select
                className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
                value={selectedIdType}
                onChange={handleIdTypeChange}
                required
              >
                <option value="">{t("kycchoose")}</option>
                <option value="idCard">{t("kycid")}</option>
                <option value="passport">{t("kycpass")}</option>
                <option value="driversLicense">{t("kycdl")}</option>
              </select>
            </div>

            {selectedIdType === "idCard" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {t("kycidupload1")}
                  </label>
                  <input type="file" name="frontId" onChange={handleFileChange} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {t("kycidupload2")}
                  </label>
                  <input type="file" name="backId" onChange={handleFileChange} required />
                </div>
              </>
            )}

            {selectedIdType === "passport" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {t("kycpassupload")}
                </label>
                <input type="file" name="passportId" onChange={handleFileChange} required />
              </div>
            )}

            {selectedIdType === "driversLicense" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {t("kycdlupload")}
                </label>
                <input type="file" name="driversLicenseId" onChange={handleFileChange} required />
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                disabled={loading}
              >
                {loading ? `${t("uploading...")} ` : `${t("submitkyc")} `}

              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCConfirmation;
