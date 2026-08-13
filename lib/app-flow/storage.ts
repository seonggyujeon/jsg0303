import { isAppLocale } from "@/lib/i18n/config";
import type { PersistedAppFlow } from "@/types/app-flow";

const STORAGE_KEY = "ocean-log:app-flow:v3";

export const INITIAL_APP_FLOW: PersistedAppFlow = {
  version: 3,
  locale: null,
  downloadComplete: false,
  onboardingComplete: false,
};

export function readAppFlow(): PersistedAppFlow {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      // Do not migrate the old completion flag: every existing installation
      // must confirm its language once for this onboarding revision.
      return INITIAL_APP_FLOW;
    }
    const parsed = JSON.parse(value) as Partial<PersistedAppFlow>;
    if (parsed.version !== 3) return INITIAL_APP_FLOW;
    return {
      version: 3,
      locale: isAppLocale(parsed.locale) ? parsed.locale : null,
      downloadComplete: parsed.downloadComplete === true,
      onboardingComplete: parsed.onboardingComplete === true && isAppLocale(parsed.locale),
    };
  } catch {
    return INITIAL_APP_FLOW;
  }
}

export function writeAppFlow(state: PersistedAppFlow): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The in-memory flow still works if private browsing blocks storage.
  }
}
