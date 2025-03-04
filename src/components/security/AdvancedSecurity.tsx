import React from 'react';

const AdvancedSecurity: React.FC = () => {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          AdvancedSecurity
          </h4>
          

          
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
             <div className="flex flex-col  justify-start gap-4">
            <div className="flex flex-row gap-4 ">
      <svg
        width="30"
        height="30"
        className="bn-svg !text-[20px]"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.22 11.778a3.11 3.11 0 100-6.22 3.11 3.11 0 000 6.22zM6.11 13.778A3.11 3.11 0 003 16.888v1.554h12.44v-1.555a3.11 3.11 0 00-3.11-3.11H6.11zM21 18.442h-3.56v-1.555c0-1.17-.394-2.248-1.055-3.11h1.505a3.11 3.11 0 013.11 3.11v1.555zM14.33 8.668a5.087 5.087 0 01-.852 2.825 3.11 3.11 0 100-5.65c.538.809.852 1.78.852 2.825z" fill="#98A2B3"></path>
      </svg>
      <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
      Account Connections

      </p>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
      Connect your account with third-party accounts.

      </p>
    </div>
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
    <a
  href="/managewallet-deposit" // Change this to your desired link
  target="_blank" // Open the link in a new tab
  rel="noopener noreferrer" // Security best practices
>
  <button className="bg-blue-500 text-gray-700 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
    Manage Your Wallet
  </button>
</a>

    </div>
  </div>
</div>
            <br/>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <svg
                              width="30" height="30"

                className="bn-svg !text-[20px]"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 16.5V3h18v13.5l-9 5.625L3 16.5zm12.16-7.906a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2 0a2.751 2.751 0 01-1.75 2.562v2.27a3.705 3.705 0 11-7.409 0V9.38l4 4h-2v.048a1.705 1.705 0 103.41 0v-2.271a2.75 2.75 0 113.75-2.562z" fill="#98A2B3"></path>
              </svg>
              <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
              Anti-Phishing Code

              </p>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            Protect your account from phishing attempts and ensure that your notification emails are from Binance only. This is enabled.
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-800 dark:text-white/90">
              </div>
              
            </div>
          </div>
          <br/>

         


        </div>
      </div>
    </div>
  );
};

export default AdvancedSecurity;
