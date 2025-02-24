'use client';
import React, { useState } from 'react';

const Referral = () => {
  // State to handle copying the referral link
  const [copied, setCopied] = useState(false);

  // Function to copy the referral link to clipboard
  const copyToClipboard = () => {
    const referralLink = "https://ww...Q8NZ"; // Your actual referral link here
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
        <h2 className="text-4xl text-gray-500 dark:text-gray-400 font-semibold leading-snug md:text-5xl lg:text-6xl">
          Refer Friends.
        <br/>
          Get 100 USD Equivalent Trading Fee Credit Each.
        </h2>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-[1/3] border border-gray-300 rounded-lg p-5">
        <div className="mb-5">
          {/* Referral ID */}
          <div className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-2">Referral ID</div>
          <input
            type="text"
            value="CPA_001QNLQ8NZ"
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly
          />
        </div>

        <div className="mb-5">
          {/* Referral Link */}
          <div className="font-bold text-gray-500 dark:text-gray-400 text-lg mb-2">Referral Link</div>
          <input
            type="text"
            value="https://ww...Q8NZ"
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
