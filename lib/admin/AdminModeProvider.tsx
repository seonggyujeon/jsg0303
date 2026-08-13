"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const SESSION_KEY = "ocean-log:admin-mode:v1";
const ADMIN_PASSWORD_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

interface AdminModeContextValue {
  isAdmin: boolean;
  activateAdminMode: (password: string) => Promise<boolean>;
  deactivateAdminMode: () => void;
}

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

async function hashPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => setIsAdmin(window.sessionStorage.getItem(SESSION_KEY) === "active"), 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  const activateAdminMode = useCallback(async (password: string) => {
    const accepted = await hashPassword(password) === ADMIN_PASSWORD_HASH;
    if (accepted) {
      window.sessionStorage.setItem(SESSION_KEY, "active");
      setIsAdmin(true);
    }
    return accepted;
  }, []);

  const deactivateAdminMode = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, activateAdminMode, deactivateAdminMode }), [activateAdminMode, deactivateAdminMode, isAdmin]);
  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>;
}

export function useAdminMode(): AdminModeContextValue {
  const value = useContext(AdminModeContext);
  if (!value) throw new Error("useAdminMode must be used within AdminModeProvider");
  return value;
}
