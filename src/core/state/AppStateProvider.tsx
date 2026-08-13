import { createContext, useContext, useMemo, useReducer, type Dispatch, type PropsWithChildren } from "react";
import type { ActivityCategory } from "../../features/recommendations/domain/models";
import type { Locale } from "../i18n/types";
import { env } from "../config/env";

export interface AppState {
  locale: Locale;
  category: ActivityCategory;
  people: number;
}

export type AppAction =
  | { type: "locale/set"; locale: Locale }
  | { type: "category/set"; category: ActivityCategory }
  | { type: "people/set"; people: number };

const initialState: AppState = { locale: env.defaultLocale, category: "all", people: 2 };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "locale/set": return { ...state, locale: action.locale };
    case "category/set": return { ...state, category: action.category };
    case "people/set": return { ...state, people: Math.max(1, Math.min(10, action.people)) };
  }
}

const AppStateContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used within AppStateProvider");
  return value;
}
