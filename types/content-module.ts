import type { LocalizedText } from "@/types/i18n";
import type { MainTabId } from "@/types/navigation";

export interface ContentModuleSlotDefinition {
  id: string;
  screen: MainTabId;
  label: LocalizedText;
  accepts: LocalizedText;
}
