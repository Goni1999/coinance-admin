"use client";
import React from "react";
import { useTranslations } from 'next-intl';


export default function SecurityCheckup() {
    const t = useTranslations();
  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("sec13")}

            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-md leading-normal text-green-500 dark:text-green-400">
                {t("sec14")} 
                                </p>
                
              </div>

              <div className="lg:ml-12">
                <p className="mb-2 text-md leading-normal text-green-500 dark:text-green-400">
                {t("sec15")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                
                </p>
              </div>

              <div >
                <p className="mb-2 text-md leading-normal text-gray-500 dark:text-gray-400">
                {t("sec16")} 
                </p>
                
              </div>

              <div>
                <p className="mb-2 text-md leading-normal text-gray-500 dark:text-gray-400">
                {t("sec17")} 

                </p>
                
              </div>
             
            </div>
          </div>

         
        </div>
      </div>
     
    </>
  );
}
