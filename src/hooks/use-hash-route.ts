import { useEffect, useState } from "react";

import type { RouteId } from "@/types/learning";

const routes: RouteId[] = ["home", "dashboard", "onboarding", "fidel", "conversation", "library", "progress"];

function getRoute(): RouteId {
  const hash = window.location.hash.replace("#", "") as RouteId;
  return routes.includes(hash) ? hash : "dashboard";
}

export function useHashRoute() {
  const [route, setRouteState] = useState<RouteId>(() => (typeof window === "undefined" ? "dashboard" : getRoute()));

  useEffect(() => {
    const onHashChange = () => setRouteState(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function setRoute(next: RouteId) {
    window.location.hash = next;
    setRouteState(next);
  }

  return [route, setRoute] as const;
}
