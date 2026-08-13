import type { MainTab } from "@/types/navigation";

export const MAIN_TABS: readonly MainTab[] = [
  { id: "home", href: "/home", icon: "home", label: { ko: "홈", zh: "首页", ja: "ホーム", en: "Home" } },
  { id: "recommend", href: "/recommend", icon: "spark", label: { ko: "추천", zh: "推荐", ja: "おすすめ", en: "Recommend" } },
  { id: "places", href: "/places", icon: "pin", label: { ko: "이동", zh: "出行", ja: "移動", en: "Directions" } },
  { id: "saved", href: "/saved", icon: "bookmark", label: { ko: "저장", zh: "收藏", ja: "保存", en: "Saved" } },
  { id: "settings", href: "/settings", icon: "settings", label: { ko: "설정", zh: "设置", ja: "設定", en: "Settings" } },
] as const;
