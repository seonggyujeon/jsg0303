"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { OceanLogBrand } from "@/components/common/OceanLogBrand";
import { LanguageApplyingScreen } from "@/features/onboarding/LanguageApplyingScreen";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { LANGUAGE_OPTIONS } from "@/lib/i18n/config";
import { APP_COPY, translate } from "@/lib/i18n/messages";
import type { AppLocale } from "@/types/i18n";

export function LanguageScreen({ onSelected }: { onSelected?: (locale: AppLocale) => void }) {
  const router = useRouter();
  const { locale, completeLanguageSelection } = useAppFlow();
  const [selectedLocale, setSelectedLocale] = useState<AppLocale | null>(locale);
  const [applyingLocale, setApplyingLocale] = useState<AppLocale | null>(null);
  const previewLocale = selectedLocale ?? "en";

  const enterApp = () => {
    if (!selectedLocale) return;
    if (onSelected) {
      onSelected(selectedLocale);
      return;
    }
    setApplyingLocale(selectedLocale);
  };

  const finishApplying = useCallback(() => {
    if (!applyingLocale) return;
    completeLanguageSelection(applyingLocale);
    router.replace("/home");
  }, [applyingLocale, completeLanguageSelection, router]);

  if (applyingLocale) {
    return <LanguageApplyingScreen locale={applyingLocale} onComplete={finishApplying} />;
  }

  return (
    <main className="ol-onboarding ol-language-screen">
      <div className="ol-onboarding__content">
        <OceanLogBrand />
        <div className="ol-language-screen__heading">
          <p className="ol-kicker">LANGUAGE</p>
          <h1>{translate(APP_COPY.selectLanguage, previewLocale)}</h1>
          <p>{translate(APP_COPY.selectLanguageHint, previewLocale)}</p>
        </div>
        <div className="ol-language-grid" role="radiogroup" aria-label="Language">
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = selectedLocale === option.locale;
            return (
              <button
                aria-checked={selected}
                className={selected ? "is-selected" : ""}
                key={option.locale}
                onClick={() => setSelectedLocale(option.locale)}
                role="radio"
                type="button"
              >
                <span>{option.nativeLabel}</span>
                <small>{option.regionLabel}</small>
                <i aria-hidden="true">{selected ? "✓" : ""}</i>
              </button>
            );
          })}
        </div>
        <button className="ol-primary-action" disabled={!selectedLocale} onClick={enterApp} type="button">
          {translate(APP_COPY.enterApp, previewLocale)} <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}
