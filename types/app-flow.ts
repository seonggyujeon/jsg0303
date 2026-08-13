import type { AppLocale } from "@/types/i18n";

export type AppPhase = "download" | "language" | "main";

export interface PersistedAppFlow {
  version: 3;
  locale: AppLocale | null;
  downloadComplete: boolean;
  onboardingComplete: boolean;
}

export interface AppFlowState extends PersistedAppFlow {
  hydrated: boolean;
  phase: AppPhase;
}
