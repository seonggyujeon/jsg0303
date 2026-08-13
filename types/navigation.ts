import type { LocalizedText } from "@/types/i18n";

export type MainTabId = "home" | "places" | "recommend" | "saved" | "settings";

export interface MainTab {
  id: MainTabId;
  href: `/${string}`;
  label: LocalizedText;
  icon: "home" | "pin" | "spark" | "bookmark" | "settings";
}
