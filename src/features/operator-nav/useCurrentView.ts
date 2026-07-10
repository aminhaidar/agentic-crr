import { useEffect, useState } from "react";

/**
 * Tracks the engine's active nav key (home/dashboard/filings/sources/settings)
 * so the Unify nav can highlight the current section. The engine fires
 * `__opViewChanged` from `go()` on every view change.
 */
export function useCurrentView(): string {
  const [nav, setNav] = useState<string>(
    () =>
      document.querySelector(".nav-item.active")?.getAttribute("data-nav") ??
      "home",
  );

  useEffect(() => {
    window.__opViewChanged = (next) => setNav(next);
    return () => {
      delete window.__opViewChanged;
    };
  }, []);

  return nav;
}
