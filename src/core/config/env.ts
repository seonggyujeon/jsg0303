import type { Locale } from "../i18n/types";

const publicEnv = import.meta.env;
const supportedLocales: Locale[] = ["en", "ko", "ja", "zh"];
const requestedLocale = publicEnv.VITE_PUBLIC_DEFAULT_LOCALE;

export const env = Object.freeze({
  appName: publicEnv.VITE_PUBLIC_APP_NAME || "BUSAN BLUE",
  defaultLocale: supportedLocales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : "en",
});
