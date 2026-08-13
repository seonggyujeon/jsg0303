export interface OceanLogUser {
  id: string;
  displayName: string;
}

export interface AuthPort {
  getCurrentUser(): Promise<OceanLogUser | null>;
  signIn(): Promise<OceanLogUser>;
  signOut(): Promise<void>;
}

// Authentication is intentionally interface-only until a provider is selected.
export const authCapabilityStatus = "placeholder" as const;
