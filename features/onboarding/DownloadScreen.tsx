"use client";

import { useEffect, useState } from "react";
import { OceanLogBrand } from "@/components/common/OceanLogBrand";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { prepareInitialAppData } from "@/lib/app-flow/download-service";
import { APP_COPY, translate } from "@/lib/i18n/messages";

export function DownloadScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const { locale } = useAppFlow();
  const activeLocale = locale ?? "en";

  useEffect(() => {
    const controller = new AbortController();
    prepareInitialAppData({ signal: controller.signal, onProgress: setProgress })
      .then(() => {
        if (!controller.signal.aborted) onComplete();
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
      });
    return () => controller.abort();
  }, [onComplete]);

  return (
    <main className="ol-onboarding ol-download-screen">
      <div className="ol-download-screen__sea" aria-hidden="true"><i /><i /><i /></div>
      <div className="ol-onboarding__content">
        <OceanLogBrand />
        <div className="ol-download-screen__copy">
          <p className="ol-kicker">WELCOME TO BUSAN&apos;S COAST</p>
          <h1>{translate(APP_COPY.downloadTitle, activeLocale)}</h1>
          <p>{translate(APP_COPY.downloadDescription, activeLocale)}</p>
        </div>
        <div className="ol-progress" aria-label="App data preparation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} role="progressbar">
          <div className="ol-progress__meta"><span>INITIALIZING APP DATA</span><strong>{progress}%</strong></div>
          <div className="ol-progress__track"><span style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
    </main>
  );
}
