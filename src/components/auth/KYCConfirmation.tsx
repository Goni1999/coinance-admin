"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const KYCConfirmation = () => {
  const router = useRouter();

  // Ensure hooks are called at the top level
  const [selectedIdType, setSelectedIdType] = useState<string>("");
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    frontId: null,
    backId: null,
    passportId: null,
    driversLicenseId: null,
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) {
      setIsAuthenticated(false);
      router.push("/signin");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering when redirecting
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uploads");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dqysonzsh/upload",
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const key in files) {
        if (files[key]) {
          const url = await uploadToCloudinary(files[key] as File);
          uploadedUrls.push(url);
        }
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || sessionStorage.getItem("token")
          : null;
      if (!token) {
        alert("User not authenticated.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        "https://server.capital-trust.eu/auth/save-kyc",
        { urls: uploadedUrls },
        { headers }
      );

      alert("KYC Verification Submitted Successfully!");
      setTimeout(() => {
        router.push("/pending");
      }, 3000);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          Back
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            KYC Verification
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your identification documents to complete the KYC verification process.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Select ID Type<span className="text-error-500">*</span>
              </label>
              <select
                className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
                value={selectedIdType}
                onChange={handleIdTypeChange}
                required
              >
                <option value="">Choose an ID Type</option>
                <option value="idCard">ID Card</option>
                <option value="passport">Passport</option>
                <option value="driversLicense">Driver&apos;s License</option>
              </select>
            </div>

            {selectedIdType === "idCard" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Upload Front of ID
                  </label>
                  <input type="file" name="frontId" onChange={handleFileChange} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Upload Back of ID
                  </label>
                  <input type="file" name="backId" onChange={handleFileChange} required />
                </div>
              </>
            )}

            {selectedIdType === "passport" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Upload Passport
                </label>
                <input type="file" name="passportId" onChange={handleFileChange} required />
              </div>
            )}

            {selectedIdType === "driversLicense" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Upload Driver&apos;s License
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
                {loading ? "Uploading..." : "Submit KYC"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCConfirmation;
