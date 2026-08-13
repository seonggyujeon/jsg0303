"use client";

import { LegacyRecommendationPage, type LegacyView } from "@/app/page";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";

export function BusanBlueModule({ view }: { view: LegacyView }) {
  const { locale, completeLanguageSelection } = useAppFlow();

  return (
    <div className="ol-busan-blue-module">
      <LegacyRecommendationPage
        initialLanguage={locale ?? "en"}
        onLanguageChange={completeLanguageSelection}
        view={view}
      />
    </div>
  );
}
