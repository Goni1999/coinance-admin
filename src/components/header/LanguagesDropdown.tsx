"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
];

const updateUrlWithLocale = (url: string, locale: string) => {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);

  if (!languages.some((lang) => lang.code === pathSegments[0])) {
    pathSegments.unshift(locale);
  } else {
    pathSegments[0] = locale;
  }

  return `${urlObj.origin}/${pathSegments.join("/")}`;
};

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Load language from URL or localStorage
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const storedLang = localStorage.getItem("selectedLanguage");
    const detectedLang = languages.find((lang) => lang.code === pathSegments[0])
      ? pathSegments[0]
      : storedLang || "en";

    setCurrentLanguage(detectedLang);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem("selectedLanguage", languageCode);

    const newUrl = updateUrlWithLocale(window.location.href, languageCode);
    window.location.href = newUrl;
    closeDropdown();
  };

  const currentLanguageData = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        <span className="block text-gray-800 dark:text-white">
          {currentLanguageData?.flag}
        </span>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute mt-[17px] w-[200px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Select Language
          </h5>
          <button
            onClick={closeDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {languages.map((language) => (
            <li key={language.code}>
              <DropdownItem
                onItemClick={() => handleLanguageChange(language.code)}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <span className="text-gray-800 dark:text-white">
                  {language.flag} {language.label}
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
