export interface AuthUser {
  id: string;
  displayName?: string;
  email?: string;
}

export type AuthStatus = "anonymous" | "authenticated" | "loading" | "unavailable";

export interface AuthPort {
  status: AuthStatus;
  user: AuthUser | null;
  signIn(): Promise<{ status: "unavailable" }>;
  signOut(): Promise<void>;
}
