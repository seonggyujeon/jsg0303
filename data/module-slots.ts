import type { ContentModuleSlotDefinition } from "@/types/content-module";

export const CONTENT_MODULE_SLOTS: readonly ContentModuleSlotDefinition[] = [
  { id: "home-overview", screen: "home", label: { ko: "여행 현황 요약", zh: "旅行概览", ja: "旅の概要", en: "Trip overview" }, accepts: { ko: "현재 위치 · 오늘의 바다 요약", zh: "当前位置 · 今日海况", ja: "現在地・今日の海況", en: "Current location · today's coast" } },
  { id: "places-directory", screen: "places", label: { ko: "부산 해안 장소", zh: "釜山海岸地点", ja: "釜山の海岸スポット", en: "Busan coastal places" }, accepts: { ko: "11개 장소 · 거리 · 길찾기", zh: "11个地点 · 距离 · 路线", ja: "11スポット・距離・経路", en: "11 places · distance · directions" } },
  { id: "recommend-engine", screen: "recommend", label: { ko: "맞춤 추천", zh: "个性化推荐", ja: "パーソナルおすすめ", en: "Personal recommendations" }, accepts: { ko: "날씨 · 파도 · 바람 · 혼잡도 · 인원 · 활동", zh: "天气 · 海浪 · 风 · 拥挤度 · 人数 · 活动", ja: "天気・波・風・混雑・人数・アクティビティ", en: "Weather · waves · wind · crowds · group · activity" } },
  { id: "saved-collection", screen: "saved", label: { ko: "저장한 여행", zh: "已收藏行程", ja: "保存した旅", en: "Saved trips" }, accepts: { ko: "장소 · 활동 · 이동 경로 보관", zh: "收藏地点 · 活动 · 路线", ja: "スポット・体験・経路を保存", en: "Places · activities · routes" } },
  { id: "settings-preferences", screen: "settings", label: { ko: "앱 설정", zh: "应用设置", ja: "アプリ設定", en: "App settings" }, accepts: { ko: "언어 · 위치 권한 · 로그인 연결", zh: "语言 · 定位权限 · 登录", ja: "言語・位置情報・ログイン", en: "Language · location · sign-in" } },
] as const;

export function getContentModuleSlot(screen: ContentModuleSlotDefinition["screen"]) {
  const slot = CONTENT_MODULE_SLOTS.find((item) => item.screen === screen);
  if (!slot) throw new Error(`Missing content module slot for ${screen}`);
  return slot;
}
