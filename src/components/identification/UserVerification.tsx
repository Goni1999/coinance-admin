"use client";
import React from "react";

import Image from "next/image";
import Badge from "../ui/badge/Badge";

export default function UserVerification() {
 
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user/owner1.png"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                User-3dc81 
              </h4>
              <div className="flex flex-row items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: 332522723
                </p>
                <Badge color="success">
            
            Verified
          </Badge>
              
              </div>
            </div>
           
          </div>
          
        </div>
      </div>
      
    </>
  );
}
