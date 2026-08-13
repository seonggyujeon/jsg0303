import { useSyncExternalStore } from "react";

const ROUTE_EVENT = "ocean-log:navigation";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(ROUTE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(ROUTE_EVENT, callback);
  };
}

function getPathname() {
  return window.location.pathname;
}

function notifyRouteChange() {
  window.dispatchEvent(new Event(ROUTE_EVENT));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () => "/");
}

export function useRouter() {
  return {
    push(href: string) {
      window.history.pushState(null, "", href);
      notifyRouteChange();
    },
    replace(href: string) {
      window.history.replaceState(null, "", href);
      notifyRouteChange();
    },
    back() {
      window.history.back();
    },
  };
}
