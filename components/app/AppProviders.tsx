"use client";

import type { ReactNode } from "react";
import { AppFlowProvider } from "@/lib/app-flow/AppFlowProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppFlowProvider>{children}</AppFlowProvider>;
}
