"use client";
import React from "react";

export default function PersonalInformation() {

  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information

            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-4 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Legal Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Filan Fisteku
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of Birth
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                2000-01-01
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                New York, USA
                    </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Identification Documents

                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                ID Card , ID**********23

                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                U***@gmail.com


                </p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
     
    </>
  );
}
