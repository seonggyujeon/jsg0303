"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

const SESSION_KEY = "ocean-log:admin-token:v2";

interface AdminModeContextValue {
  isAdmin: boolean;
  adminToken: string | null;
  activateAdminMode: (password: string) => Promise<boolean>;
  deactivateAdminMode: () => void;
}

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

function isTokenCurrent(token: string): boolean {
  try {
    const encodedPayload = token.split(".")[0];
    const normalized = encodedPayload.replaceAll("-", "+").replaceAll("_", "/");
    const paddedPayload = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const payload = JSON.parse(atob(paddedPayload)) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      const storedToken = window.sessionStorage.getItem(SESSION_KEY);
      if (storedToken && isTokenCurrent(storedToken)) setAdminToken(storedToken);
      else window.sessionStorage.removeItem(SESSION_KEY);
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  const activateAdminMode = useCallback(async (password: string) => {
    const { data, error } = await supabase.functions.invoke<{ token?: string }>("community-admin", {
      body: { action: "login", password },
    });
    const token = data?.token;
    if (error || !token || !isTokenCurrent(token)) return false;
    window.sessionStorage.setItem(SESSION_KEY, token);
    setAdminToken(token);
    return true;
  }, []);

  const deactivateAdminMode = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setAdminToken(null);
  }, []);

  const value = useMemo(() => ({
    isAdmin: adminToken !== null,
    adminToken,
    activateAdminMode,
    deactivateAdminMode,
  }), [activateAdminMode, adminToken, deactivateAdminMode]);

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>;
}

export function useAdminMode(): AdminModeContextValue {
  const value = useContext(AdminModeContext);
  if (!value) throw new Error("useAdminMode must be used within AdminModeProvider");
  return value;
}
