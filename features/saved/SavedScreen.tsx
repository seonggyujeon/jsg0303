import { FeatureScreen } from "@/components/layout/FeatureScreen";
import { getContentModuleSlot } from "@/data/module-slots";

export function SavedScreen() {
  return <FeatureScreen number="04" title={{ ko: "마음에 든 바다를 모아요", zh: "收藏喜欢的海岸", ja: "気になる海を集める", en: "Keep the coast close" }} description={{ ko: "관심 장소와 활동, 경로를 이후 다시 찾을 수 있는 공간입니다.", zh: "稍后重新查看地点、活动和路线的空间。", ja: "スポット、体験、経路をあとで見返す場所です。", en: "A future collection for places, activities and routes worth returning to." }} slot={getContentModuleSlot("saved")} />;
}
