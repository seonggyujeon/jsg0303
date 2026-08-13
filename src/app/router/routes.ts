import type { ComponentType } from "react";
import { HomeRoute } from "../../routes/home/HomeRoute";
import { NotFoundRoute } from "../../routes/not-found/NotFoundRoute";

export interface AppRouteDefinition {
  path: string;
  component: ComponentType;
  public: boolean;
}

export const appRoutes: AppRouteDefinition[] = [
  { path: "/", component: HomeRoute, public: true },
];

export function resolveRoute(pathname: string): ComponentType {
  return appRoutes.find((route) => route.path === pathname)?.component ?? NotFoundRoute;
}
