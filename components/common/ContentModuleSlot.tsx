"use client";

import { APP_COPY, translate } from "@/lib/i18n/messages";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import type { ContentModuleSlotDefinition } from "@/types/content-module";

export function ContentModuleSlot({
  slot,
  onActivate,
  actionLabel,
}: {
  slot: ContentModuleSlotDefinition;
  onActivate?: () => void;
  actionLabel?: string;
}) {
  const { locale } = useAppFlow();
  const activeLocale = locale ?? "en";

  return (
    <section className="ol-module-slot" aria-labelledby={`${slot.id}-title`}>
      {onActivate ? (
        <button
          aria-label={actionLabel ?? translate(slot.label, activeLocale)}
          className="ol-module-slot__index"
          onClick={onActivate}
          type="button"
        >
          +
        </button>
      ) : (
        <div className="ol-module-slot__index" aria-hidden="true">+</div>
      )}
      <p>{translate(APP_COPY.slotEyebrow, activeLocale)}</p>
      <h2 id={`${slot.id}-title`}>{translate(slot.label, activeLocale)}</h2>
      <span>{translate(slot.accepts, activeLocale)}</span>
    </section>
  );
}
