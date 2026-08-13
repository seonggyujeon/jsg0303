import type { PropsWithChildren } from "react";
import { AnonymousAuthProvider } from "../../core/auth/AnonymousAuthProvider";
import { AppStateProvider } from "../../core/state/AppStateProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AnonymousAuthProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </AnonymousAuthProvider>
  );
}
