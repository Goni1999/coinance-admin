"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
          <ThemeProvider>
            <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
              {children}
              {/* Sidebar for large screens */}
              <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                <div className="relative flex items-center justify-center z-1">
                  <GridShape />
                  <div className="flex flex-col items-center max-w-xs">
                    <Link href="/" className="block mb-4">
                      <Image
                        width={231}
                        height={48}
                        src="/images/logo/logo-trust.png"
                        alt="Logo"
                      />
                    </Link>
                    <p className="text-center text-gray-400 dark:text-white/60">
                      Get in another level with us
                    </p>
                  </div>
                </div>
              </div>
              {/* Theme toggler */}
              <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                <ThemeTogglerTwo />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
