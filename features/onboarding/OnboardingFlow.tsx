"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { DownloadScreen } from "@/features/onboarding/DownloadScreen";
import { LanguageScreen } from "@/features/onboarding/LanguageScreen";

export function OnboardingFlow() {
  const router = useRouter();
  const { hydrated, phase, markDownloadComplete, selectOnboardingLanguage } = useAppFlow();

  useEffect(() => {
    if (hydrated && phase === "main") router.replace("/home");
  }, [hydrated, phase, router]);

  const finishDownload = useCallback(() => {
    markDownloadComplete();
  }, [markDownloadComplete]);

  if (!hydrated || phase === "main") {
    return <main className="ol-app-loading" aria-label="Loading Ocean Log" />;
  }

  if (phase === "download") return <DownloadScreen onComplete={finishDownload} />;
  return <LanguageScreen onSelected={selectOnboardingLanguage} />;
}
