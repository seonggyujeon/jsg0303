import type { CommonMessages, Locale } from "./types";

export const commonMessages: Record<Locale, CommonMessages> = {
  en: { navigation: { home: "Home", account: "Account" }, actions: { retry: "Try again", close: "Close" } },
  ko: { navigation: { home: "홈", account: "계정" }, actions: { retry: "다시 시도", close: "닫기" } },
  ja: { navigation: { home: "ホーム", account: "アカウント" }, actions: { retry: "再試行", close: "閉じる" } },
  zh: { navigation: { home: "首页", account: "账户" }, actions: { retry: "重试", close: "关闭" } },
};
