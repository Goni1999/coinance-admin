import { IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  // messages: (await import(`./messages/${locale}.json`)).default,
  onError: (error) => {
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    } else {
      console.error(error);
    }
  },
  getMessageFallback: ({ namespace, key, error }) => {
    const path = [namespace, key].filter((part) => part != null).join(".");

    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      return path;
    } else {
      return "Dear developer, please fix this message: " + path;
    }
  },
}));