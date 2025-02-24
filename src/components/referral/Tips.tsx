'use client';
import React from 'react';

const Tips = () => {
  // State to handle copying the referral link
 
  return (
    <div className="p-5">
      {/* Title and Icon - Full width, above the steps */}
      <div className="flex items-center mb-10 w-full text-left">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-8 w-8">
            <path d="M10 0.833312C13.912 0.833312 17.0833 4.00463 17.0833 7.91665C17.0833 10.2713 15.9344 12.0454 14.1667 13.3333H5.83333C4.06555 12.0454 2.91666 10.2713 2.91666 7.91665C2.91666 4.00463 6.08798 0.833312 10 0.833312Z" fill="#FFFFFF"></path>
            <path d="M10.8333 13.3334L10.8332 11.1786L13.9225 8.08934L12.7439 6.91083L9.99986 9.65491L7.25578 6.91083L6.07727 8.08934L9.16653 11.1786L9.16665 13.3334H5.83334V17.5H9.16667V19.1667H10.8333V17.5H14.1667V13.3334H10.8333Z" fill="#76808F"></path>
            <defs><linearGradient id="paint0_linear_tooltip_g" x1="10" y1="13.3333" x2="10" y2="0.833312" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"></stop><stop offset="1" stop-color="#F8D33A"></stop></linearGradient></defs>
          </svg>
          <h3 className="text-3xl text-gray-500 dark:text-gray-400 font-semibold">Tips</h3>
        </div>
      </div>

      {/* Referral Steps */}
      <div className="flex justify-between gap-x-6 mb-10">
        {/* Step 1 */}
        <div className="w-1/3 sm:w-full p-5 border border-gray-300 rounded-lg mb-8">
          <div className="text-2xl text-gray-500 dark:text-gray-400 font-semibold mb-3 text-left">Step 1</div>
          <div className="text-lg text-gray-500 dark:text-gray-400 text-left">Share your referral link with friends</div>
        </div>

        {/* Step 2 */}
        <div className="w-1/3 sm:w-full p-5 border border-gray-300 rounded-lg mb-6">
          <div className="text-2xl text-gray-500 dark:text-gray-400 font-semibold mb-3 text-left">Step 2</div>
          <div className="text-lg text-gray-500 dark:text-gray-400 text-left">Invite friends to sign up and accumulatively deposit more than $50</div>
        </div>

        {/* Step 3 */}
        <div className="w-1/3 sm:w-full p-5 border border-gray-300 rounded-lg mb-6">
          <div className="text-2xl text-gray-500 dark:text-gray-400 font-semibold mb-3 text-left">Step 3</div>
          <div className="text-lg text-gray-500 dark:text-gray-400 text-left">Receive 100 USD cashback voucher each</div>
        </div>
      </div>

      {/* Rules Section - Full Width Below Steps */}
      <div data-testid="activity_rules_container" className="w-full p-5 border-t border-gray-300 mt-10">
        <div className="mb-5">
          <div className="flex items-center space-x-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
              <path d="M8 4H2v16h10V8a4 4 0 00-4-4z" fill="#FFFFFF"></path>
              <path d="M8 16H2v4h10a4 4 0 00-4-4z" fill="#76808F"></path>
              <path d="M16 4h6v16H12V8a4 4 0 014-4z" fill="#FFFFFF"></path>
              <path d="M16 16h6v4H12a4 4 0 014-4z" fill="#76808F"></path>
              <defs>
                <linearGradient id="educate-g_svg__paint0_linear" x1="7" y1="20" x2="7" y2="4" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F0B90B"></stop><stop offset="1" stop-color="#F8D33A"></stop>
                </linearGradient>
                <linearGradient id="educate-g_svg__paint1_linear" x1="17" y1="20" x2="17" y2="4" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F0B90B"></stop><stop offset="1" stop-color="#F8D33A"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="text-xl font-semibold text-gray-500 dark:text-gray-400">Rules</div>
          </div>
          <div className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            Share your Referral ID / link with a friend who does not have a Binance account.
          </div>
          <div className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            <strong>Regular Task:</strong> Referees must accumulatively deposit more than $50 within 14 days of registration. Both referrer and referee will be rewarded with a 100 USD trading fee rebate voucher each.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            <strong>Disclaimer:</strong> You can only claim one reward per referral. For example, you will not be eligible for Referral Pro rewards if friends sign up using your [Referral Mode] ID / link.
          </div>
        </div>
        <a href="/faqs" target="_blank" className="text-blue-500 hover:underline">FAQ</a>
      </div>
    </div>
  );
};

export default Tips;
