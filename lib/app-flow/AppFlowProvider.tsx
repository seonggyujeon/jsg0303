"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, toDocumentLanguage } from "@/lib/i18n/config";
import { INITIAL_APP_FLOW, readAppFlow, writeAppFlow } from "@/lib/app-flow/storage";
import type { AppFlowState, PersistedAppFlow } from "@/types/app-flow";
import type { AppLocale } from "@/types/i18n";

interface AppFlowContextValue extends AppFlowState {
  restartOnboarding: () => void;
  selectOnboardingLanguage: (locale: AppLocale) => void;
  markDownloadComplete: () => void;
  completeLanguageSelection: (locale: AppLocale) => void;
}

const AppFlowContext = createContext<AppFlowContextValue | null>(null);

function toState(persisted: PersistedAppFlow, hydrated: boolean): AppFlowState {
  const phase = !persisted.downloadComplete
    ? "download"
    : !persisted.onboardingComplete
      ? "language"
      : "main";
  return { ...persisted, hydrated, phase };
}

export function AppFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppFlowState>(() => toState(INITIAL_APP_FLOW, false));

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      setState(toState(readAppFlow(), true));
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    document.documentElement.lang = toDocumentLanguage(state.locale ?? DEFAULT_LOCALE);
  }, [state.hydrated, state.locale]);

  const updatePersistedState = useCallback((recipe: (current: PersistedAppFlow) => PersistedAppFlow) => {
    setState((current) => {
      const currentPersisted: PersistedAppFlow = {
        version: current.version,
        locale: current.locale,
        downloadComplete: current.downloadComplete,
        onboardingComplete: current.onboardingComplete,
      };
      const nextPersisted = recipe(currentPersisted);
      writeAppFlow(nextPersisted);
      return toState(nextPersisted, true);
    });
  }, []);

  const markDownloadComplete = useCallback(() => {
    updatePersistedState((current) => ({
      ...current,
      downloadComplete: true,
      onboardingComplete: current.locale !== null,
    }));
  }, [updatePersistedState]);

  const selectOnboardingLanguage = useCallback((locale: AppLocale) => {
    updatePersistedState((current) => ({
      ...current,
      locale,
      downloadComplete: false,
      onboardingComplete: false,
    }));
  }, [updatePersistedState]);

  const restartOnboarding = useCallback(() => {
    updatePersistedState((current) => ({
      ...current,
      locale: null,
      downloadComplete: false,
      onboardingComplete: false,
    }));
  }, [updatePersistedState]);

  const completeLanguageSelection = useCallback((locale: AppLocale) => {
    updatePersistedState((current) => ({
      ...current,
      locale,
      downloadComplete: true,
      onboardingComplete: true,
    }));
  }, [updatePersistedState]);

  const value = useMemo<AppFlowContextValue>(() => ({
    ...state,
    restartOnboarding,
    selectOnboardingLanguage,
    markDownloadComplete,
    completeLanguageSelection,
  }), [completeLanguageSelection, markDownloadComplete, restartOnboarding, selectOnboardingLanguage, state]);

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}

export function useAppFlow(): AppFlowContextValue {
  const value = useContext(AppFlowContext);
  if (!value) throw new Error("useAppFlow must be used within AppFlowProvider");
  return value;
}
