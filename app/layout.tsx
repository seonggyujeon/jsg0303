import type { Metadata } from "next";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-sans-kr";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";
import "./location.css";
import "./guide.css";
import "./reasons.css";
import "./theme.css";
import "./directions.css";
import "./light-theme.css";
import "./ocean-log.css";
import "./community.css";
import "./place-photos.css";
import "./admin-mode.css";
import { AppProviders } from "@/components/app/AppProviders";

export const metadata: Metadata = {
  title: "오션로그 Ocean Log | 부산 해양활동 여행 가이드",
  description: "부산의 해안 장소와 해양활동을 여행자의 조건에 맞게 연결하는 모바일 우선 여행 가이드입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProviders>{children}</AppProviders></body></html>;
}
