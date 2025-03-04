"use client";
import { IntlErrorCode, NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import React from "react";

// Add type definitions for props
type NextIntlProviderProps = {
  children: React.ReactNode;
  params: { locale: string }; // Assuming params has a locale property
  messages: Record<string, string>; // Assuming messages is an object
};

const NextIntlProvider = ({ children, params, messages }: NextIntlProviderProps) => {
  const locale = useLocale();

  if (params.locale !== locale) {
    notFound();
  }

  const onError = (error: Error) => {
    if (error instanceof Error) {
      // Handle the error in a more specific way, if needed
      if (error.message.includes(IntlErrorCode.MISSING_MESSAGE)) {
        // Handle the missing message error
      } else {
        console.error(error);
      }
    }
  };

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      onError={onError}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default NextIntlProvider;
