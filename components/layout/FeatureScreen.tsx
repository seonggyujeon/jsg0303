"use client";

import type { ReactNode } from "react";
import { ContentModuleSlot } from "@/components/common/ContentModuleSlot";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import type { ContentModuleSlotDefinition } from "@/types/content-module";
import type { LocalizedText } from "@/types/i18n";

export function FeatureScreen({
  number,
  title,
  description,
  slot,
  footer,
  onSlotActivate,
  slotActionLabel,
  hideIntro = false,
}: {
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  slot: ContentModuleSlotDefinition;
  footer?: ReactNode;
  onSlotActivate?: () => void;
  slotActionLabel?: string;
  hideIntro?: boolean;
}) {
  const { locale } = useAppFlow();
  const activeLocale = locale ?? "en";
  return (
    <main className="ol-feature-screen">
      {!hideIntro && <section className="ol-feature-screen__intro">
        <p>OCEAN LOG · {number}</p>
        <h1>{title[activeLocale]}</h1>
        <span>{description[activeLocale]}</span>
      </section>}
      <ContentModuleSlot actionLabel={slotActionLabel} onActivate={onSlotActivate} slot={slot} />
      {footer}
    </main>
  );
}
