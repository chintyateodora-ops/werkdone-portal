import { useMemo, useSyncExternalStore } from "react";

/**
 * Re-render when the legacy bundle finishes `bindEvents` (increments `__WD_PORTAL_TICK__`).
 */
export function usePortalTick() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const fn = () => onStoreChange();
      window.addEventListener("wd-portal-update", fn);
      window.addEventListener("hashchange", fn);
      return () => {
        window.removeEventListener("wd-portal-update", fn);
        window.removeEventListener("hashchange", fn);
      };
    },
    () => window.__WD_PORTAL_TICK__ ?? 0,
    () => 0
  );
}

export function usePortalApi() {
  const tick = usePortalTick();
  return useMemo(() => window.__WD_PORTAL_API__ || null, [tick]);
}
