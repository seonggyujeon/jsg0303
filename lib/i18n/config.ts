import { SUPPORTED_LOCALES, type AppLocale } from "@/types/i18n";

export const DEFAULT_LOCALE: AppLocale = "en";

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  locale: AppLocale;
  nativeLabel: string;
  regionLabel: string;
}> = [
  { locale: "ko", nativeLabel: "한국어", regionLabel: "대한민국" },
  { locale: "zh", nativeLabel: "中文", regionLabel: "简体中文" },
  { locale: "ja", nativeLabel: "日本語", regionLabel: "日本" },
  { locale: "en", nativeLabel: "English", regionLabel: "Global" },
];

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function toDocumentLanguage(locale: AppLocale): string {
  return locale === "zh" ? "zh-CN" : locale;
}
