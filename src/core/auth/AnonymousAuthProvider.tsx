import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { AuthPort } from "./types";

const AuthContext = createContext<AuthPort | null>(null);

export function AnonymousAuthProvider({ children }: PropsWithChildren) {
  const value = useMemo<AuthPort>(() => ({
    status: "anonymous",
    user: null,
    signIn: async () => ({ status: "unavailable" }),
    signOut: async () => undefined,
  }), []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AnonymousAuthProvider");
  return value;
}
