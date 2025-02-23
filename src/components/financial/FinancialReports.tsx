import React from 'react';

const FinancialReports: React.FC = () => {
  return (
    <div className="px-m py-0 tablet:px-[64px] tablet:py-xl bg-CardBg min-h-[calc(100vh-100px)]">
      <div className="bn-flex" style={{ flexDirection: 'column', gap: 'var(--space-xl)' }}>
        <div className="flex items-end justify-between mt-5" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="text-gray-500 dark:text-gray-400">Financial Reports</h1>
          <button className="inline-flex items-center lg:px-20 gap-2 mt-4 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            
                     <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="bn-svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.997 12.21a8.161 8.161 0 000-.42v.42zm-4.463 3.327l-2.608-2.608h7.07V20l-2.341-2.342A8.003 8.003 0 014.252 14h3.164a5.001 5.001 0 008.118 1.537zM19.747 10A8.003 8.003 0 006.343 6.343L4.001 4v7.071h7.07L8.466 8.464A5.001 5.001 0 0116.585 10h3.162zM4 12L4 11.845v.31A8.126 8.126 0 014 12z"
                fill="currentColor"
              ></path>
            </svg>
            Refresh
          </button>
        </div>
        <div className="flex mt-16" style={{ flexDirection: 'column', alignItems: 'center', gap: 'var(--space-xl)' }}>
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M64 8H26V88H84V28L64 8ZM36 37H74V41H36V37ZM36 46H74V50H36V46ZM74 55H36V59H74V55Z"
              fill="url(#paint0_linear_2461_390787)"
            ></path>
            <path d="M62 71L66 67L70 71L66 75L62 71Z" fill="#1E2026"></path>
            <path d="M86 50L89 47L92 50L89 53L86 50Z" fill="#474D57"></path>
            <path d="M47 21L50 18L53 21L50 24L47 21Z" fill="#474D57"></path>
            <path d="M84 28H64V8L84 28Z" fill="#474D57"></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.17151 73.1717L18.6716 58.6718L24.3284 64.3287L9.82834 78.8286L4.17151 73.1717Z"
              fill="url(#paint1_linear_2461_390787)"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M51 48C51 39.1634 43.8366 32 35 32C26.1634 32 19 39.1634 19 48C19 56.8366 26.1634 64 35 64C43.8366 64 51 56.8366 51 48ZM55 48C55 36.9543 46.0457 28 35 28C23.9543 28 15 36.9543 15 48C15 59.0457 23.9543 68 35 68C46.0457 68 55 59.0457 55 48Z"
              fill="url(#paint2_linear_2461_390787)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_2461_390787"
                x1="84"
                y1="10.1622"
                x2="84"
                y2="88"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2B2F36"></stop>
                <stop offset="1" stopColor="#474D57"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_2461_390787"
                x1="4.17151"
                y1="68.7502"
                x2="24.3284"
                y2="68.7502"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#929AA5"></stop>
                <stop offset="1" stopColor="#76808F"></stop>
              </linearGradient>
              <linearGradient
                id="paint2_linear_2461_390787"
                x1="15"
                y1="48"
                x2="55"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#929AA5"></stop>
                <stop offset="1" stopColor="#76808F"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-6 text-gray-500 dark:text-gray-400" >There are no documents generated for you at this time.</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
