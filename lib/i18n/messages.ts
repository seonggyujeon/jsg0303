import type { AppLocale, LocalizedText } from "@/types/i18n";

export const APP_COPY = {
  downloadTitle: {
    ko: "오션로그를 준비하고 있어요",
    zh: "正在准备 Ocean Log",
    ja: "Ocean Log を準備しています",
    en: "Preparing Ocean Log",
  },
  downloadDescription: {
    ko: "여행에 필요한 기본 데이터를 안전하게 초기화합니다.",
    zh: "正在安全初始化旅行所需的基础数据。",
    ja: "旅に必要な基本データを安全に初期化しています。",
    en: "Setting up the essentials for your coastal journey.",
  },
  selectLanguage: {
    ko: "사용할 언어를 선택하세요",
    zh: "选择您的语言",
    ja: "言語を選択してください",
    en: "Choose your language",
  },
  selectLanguageHint: {
    ko: "설정에서 언제든 다시 변경할 수 있어요.",
    zh: "您可以随时在设置中更改。",
    ja: "設定からいつでも変更できます。",
    en: "You can change it later in Settings.",
  },
  enterApp: {
    ko: "오션로그 시작하기",
    zh: "开始使用 Ocean Log",
    ja: "Ocean Log をはじめる",
    en: "Start Ocean Log",
  },
  slotEyebrow: {
    ko: "CONTENT MODULE SLOT",
    zh: "CONTENT MODULE SLOT",
    ja: "CONTENT MODULE SLOT",
    en: "CONTENT MODULE SLOT",
  },
} satisfies Record<string, LocalizedText>;

export function translate(text: LocalizedText, locale: AppLocale): string {
  return text[locale];
}
