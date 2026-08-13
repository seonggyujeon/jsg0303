export const SUPPORTED_LOCALES = ["ko", "zh", "ja", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocalizedText = Record<AppLocale, string>;
