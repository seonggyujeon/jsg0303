"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { DownloadScreen } from "@/features/onboarding/DownloadScreen";
import { LanguageScreen } from "@/features/onboarding/LanguageScreen";
import type { AppLocale } from "@/types/i18n";

type OnboardingStage = "language" | "download";

export function OnboardingFlow() {
  const router = useRouter();
  const [hasRestarted, setHasRestarted] = useState(false);
  const [stage, setStage] = useState<OnboardingStage>("language");
  const { hydrated, restartOnboarding, selectOnboardingLanguage, markDownloadComplete } = useAppFlow();

  useEffect(() => {
    if (!hydrated || hasRestarted) return;
    const restartTask = window.setTimeout(() => {
      restartOnboarding();
      setHasRestarted(true);
    }, 0);
    return () => window.clearTimeout(restartTask);
  }, [hasRestarted, hydrated, restartOnboarding]);

  const chooseLanguage = useCallback((locale: AppLocale) => {
    selectOnboardingLanguage(locale);
    setStage("download");
  }, [selectOnboardingLanguage]);

  const finishDownload = useCallback(() => {
    markDownloadComplete();
    router.replace("/home");
  }, [markDownloadComplete, router]);

  if (!hydrated || !hasRestarted) {
    return <main className="ol-app-loading" aria-label="Loading Ocean Log" />;
  }

  if (stage === "language") return <LanguageScreen onSelected={chooseLanguage} />;
  return <DownloadScreen onComplete={finishDownload} />;
}
