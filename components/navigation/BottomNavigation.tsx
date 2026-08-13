"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { MAIN_TABS } from "@/lib/navigation/tabs";

const TAB_ICONS = {
  home: "⌂",
  pin: "◉",
  spark: "✦",
  bookmark: "♡",
  settings: "⚙",
} as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const { locale } = useAppFlow();
  const activeLocale = locale ?? "en";

  return (
    <nav className="ol-bottom-nav" aria-label="Main navigation">
      <div className="ol-bottom-nav__inner">
        {MAIN_TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link aria-current={active ? "page" : undefined} className={active ? "is-active" : ""} href={tab.href} key={tab.id}>
              <span aria-hidden="true">{TAB_ICONS[tab.icon]}</span>
              <small>{tab.label[activeLocale]}</small>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
