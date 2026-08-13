"use client";

import type { ReactNode } from "react";
import { AdminModeProvider } from "@/lib/admin/AdminModeProvider";
import { AppFlowProvider } from "@/lib/app-flow/AppFlowProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppFlowProvider><AdminModeProvider>{children}</AdminModeProvider></AppFlowProvider>;
}
