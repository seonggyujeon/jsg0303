import { isAppLocale } from "@/lib/i18n/config";
import type { PersistedAppFlow } from "@/types/app-flow";

const STORAGE_KEY = "ocean-log:app-flow:v2";
const PREVIOUS_STORAGE_KEY = "ocean-log:app-flow:v1";

export const INITIAL_APP_FLOW: PersistedAppFlow = {
  version: 2,
  locale: null,
  downloadComplete: false,
  onboardingComplete: false,
};

export function readAppFlow(): PersistedAppFlow {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      const previousValue = window.localStorage.getItem(PREVIOUS_STORAGE_KEY);
      if (!previousValue) return INITIAL_APP_FLOW;
      const previous = JSON.parse(previousValue) as { locale?: unknown; downloadComplete?: unknown };
      return {
        version: 2,
        locale: isAppLocale(previous.locale) ? previous.locale : null,
        downloadComplete: previous.downloadComplete === true,
        onboardingComplete: false,
      };
    }
    const parsed = JSON.parse(value) as Partial<PersistedAppFlow>;
    if (parsed.version !== 2) return INITIAL_APP_FLOW;
    return {
      version: 2,
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
