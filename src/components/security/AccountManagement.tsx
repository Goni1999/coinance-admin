import React from 'react';

const AccountManagement: React.FC = () => {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Account Management

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
<g id="Group 1216402158"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M7.9949 9.99999C9.83589 9.99999 11.3283 8.50761 11.3283 6.66666C11.3283 4.82571 9.83589 3.33333 7.9949 3.33333C6.15392 3.33333 4.6615 4.82571 4.6615 6.66666C4.6615 8.50761 6.15392 9.99999 7.9949 9.99999ZM10.4293 11.6849C10.314 11.6729 10.1968 11.6667 10.0783 11.6667H5.91153C4.07054 11.6667 2.57812 13.159 2.57812 15V16.6667H10.293C9.89128 15.9657 9.6616 15.1534 9.6616 14.2875C9.6616 13.328 9.94364 12.4343 10.4293 11.6849Z" fill="#98A2B3"></path><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.5785 14.2875C17.5785 16.0134 16.1794 17.4125 14.4534 17.4125C12.7275 17.4125 11.3284 16.0134 11.3284 14.2875C11.3284 12.5616 12.7275 11.1625 14.4534 11.1625C16.1794 11.1625 17.5785 12.5616 17.5785 14.2875ZM16.3285 13.6625H12.5784V14.9125H16.3285V13.6625Z" fill="#98A2B3"></path></g>      </svg>
      <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
      Disable Account


      </p>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
      Once the account is disabled, most of your actions will be restricted, such as logging in and trading. You can choose to unblock the account at any time. This action will not delete your account.


      </p>
    </div>
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
    <button className="bg-blue-500 text-white inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
       Request
      </button>
    </div>
  </div>
</div>
            <br/>
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
<g id="ic/delete-account-1c"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M7.9949 10C9.83589 10 11.3283 8.50761 11.3283 6.66667C11.3283 4.82572 9.83589 3.33333 7.9949 3.33333C6.15392 3.33333 4.6615 4.82572 4.6615 6.66667C4.6615 8.50761 6.15392 10 7.9949 10ZM10.4293 11.6849C10.314 11.6729 10.1968 11.6667 10.0783 11.6667H5.91153C4.07054 11.6667 2.57812 13.159 2.57812 15V16.6667H10.293C9.89128 15.9657 9.6616 15.1534 9.6616 14.2875C9.6616 13.328 9.94364 12.4343 10.4293 11.6849Z" fill="#98A2B3"></path><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.5785 14.2875C17.5785 16.0134 16.1794 17.4125 14.4534 17.4125C12.7275 17.4125 11.3284 16.0134 11.3284 14.2875C11.3284 12.5616 12.7275 11.1625 14.4534 11.1625C16.1794 11.1625 17.5785 12.5616 17.5785 14.2875ZM16.2212 13.4036L15.3373 14.2875L16.2212 15.1714L15.3373 16.0553L14.4534 15.1714L13.5695 16.0553L12.6856 15.1714L13.5695 14.2875L12.6856 13.4036L13.5695 12.5197L14.4534 13.4036L15.3373 12.5197L16.2212 13.4036Z" fill="#98A2B3"></path></g>     
</svg>
      <p className="text-md leading-normal text-gray-500 dark:text-gray-400">
      Delete Account



      </p>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
      Please note that account deletion is irreversible. Once deleted, you will not be able to access your account or view your transaction history.


      </p>
    </div>
    <div className="flex flex-col lg:flex-row items-center gap-4">
      
    <button className="bg-blue-500 text-white inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
       Request
      </button>
    </div>
  </div>
</div>

         


        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
