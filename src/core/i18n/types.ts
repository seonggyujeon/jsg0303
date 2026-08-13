export type Locale = "en" | "ko" | "ja" | "zh";
export type LocalizedText = Record<Locale, string>;

export interface CommonMessages {
  navigation: { home: string; account: string };
  actions: { retry: string; close: string };
}
