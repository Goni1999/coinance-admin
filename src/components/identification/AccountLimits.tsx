"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function PersonalInformation() {
const t = useTranslations();
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("ident1")} 

            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-12 ">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("ident2")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {t("ident3")} 
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("ident4")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {t("ident5")} 
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("ident6")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {t("ident7")} 
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("ident8")} 
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {t("ident5")}
                </p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
     
    </>
  );
}
