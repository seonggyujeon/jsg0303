"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OceanLogBrand } from "@/components/common/OceanLogBrand";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";

export function MainAppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, onboardingComplete } = useAppFlow();

  useEffect(() => {
    if (hydrated && !onboardingComplete) router.replace("/");
  }, [hydrated, onboardingComplete, router]);

  if (!hydrated || !onboardingComplete) {
    return <main className="ol-app-loading" aria-label="Loading Ocean Log" />;
  }

  return (
    <div className={["/home", "/places", "/recommend"].includes(pathname) ? "ol-main-app ol-main-app--wide" : "ol-main-app"}>
      <header className="ol-app-header">
        <OceanLogBrand compact />
        <span>BUSAN COASTAL GUIDE</span>
      </header>
      <div className="ol-screen-transition" key="main-content">{children}</div>
      <BottomNavigation />
    </div>
  );
}
