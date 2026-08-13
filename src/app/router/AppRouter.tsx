import { usePathname } from "next/navigation";
import { MainAppShell } from "../../../components/layout/MainAppShell";
import { HomeScreen } from "../../../features/home/HomeScreen";
import { OnboardingFlow } from "../../../features/onboarding/OnboardingFlow";
import { LanguageScreen } from "../../../features/onboarding/LanguageScreen";
import { PlacesScreen } from "../../../features/places/PlacesScreen";
import { RecommendScreen } from "../../../features/recommend/RecommendScreen";
import { SavedScreen } from "../../../features/saved/SavedScreen";
import { SettingsScreen } from "../../../features/settings/SettingsScreen";

const MAIN_SCREENS = {
  "/home": HomeScreen,
  "/places": PlacesScreen,
  "/recommend": RecommendScreen,
  "/saved": SavedScreen,
  "/settings": SettingsScreen,
} as const;

export function AppRouter() {
  const pathname = usePathname();
  if (pathname === "/") return <OnboardingFlow />;
  if (pathname === "/language") return <LanguageScreen />;
  const Screen = MAIN_SCREENS[pathname as keyof typeof MAIN_SCREENS];
  if (!Screen) {
    window.history.replaceState(null, "", "/home");
    return <MainAppShell><HomeScreen /></MainAppShell>;
  }
  return <MainAppShell><Screen /></MainAppShell>;
}
