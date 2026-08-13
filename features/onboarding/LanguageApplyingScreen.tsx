"use client";

import { useEffect, useState } from "react";
import { OceanLogBrand } from "@/components/common/OceanLogBrand";
import { applyLanguageResources } from "@/lib/app-flow/download-service";
import type { AppLocale, LocalizedText } from "@/types/i18n";

const COPY: Record<"title" | "description" | "progress", LocalizedText> = {
  title: { ko: "언어 적용 중", zh: "正在应用语言", ja: "言語を適用中", en: "Applying language" },
  description: { ko: "선택한 언어로 오션로그를 준비하고 있어요.", zh: "正在以所选语言准备 Ocean Log。", ja: "選択した言語でOcean Logを準備しています。", en: "Preparing Ocean Log in your selected language." },
  progress: { ko: "언어 설정 적용", zh: "应用语言设置", ja: "言語設定を適用", en: "APPLYING LANGUAGE" },
};

export function LanguageApplyingScreen({ locale, onComplete }: { locale: AppLocale; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    applyLanguageResources({ signal: controller.signal, onProgress: setProgress })
      .then(() => {
        if (!controller.signal.aborted) onComplete();
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
      });
    return () => controller.abort();
  }, [onComplete]);

  return (
    <main className="ol-onboarding ol-download-screen ol-language-applying">
      <div className="ol-download-screen__sea" aria-hidden="true"><i /><i /><i /></div>
      <div className="ol-onboarding__content">
        <OceanLogBrand />
        <div className="ol-download-screen__copy">
          <p className="ol-kicker">OCEAN LOG LANGUAGE</p>
          <h1>{COPY.title[locale]}</h1>
          <p>{COPY.description[locale]}</p>
        </div>
        <div className="ol-progress" aria-label={COPY.progress[locale]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} role="progressbar">
          <div className="ol-progress__meta"><span>{COPY.progress[locale]}</span><strong>{progress}%</strong></div>
          <div className="ol-progress__track"><span style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
    </main>
  );
}
