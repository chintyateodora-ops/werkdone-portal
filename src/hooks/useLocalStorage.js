import { useCallback, useSyncExternalStore } from "react";

function subscribeStorage(key, onStoreChange) {
  const fn = (e) => {
    if (e.storageArea !== localStorage) return;
    if (e.key != null && e.key !== key) return;
    onStoreChange();
  };
  window.addEventListener("storage", fn);
  window.addEventListener(`${key}:local`, fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener(`${key}:local`, fn);
  };
}

/**
 * Syncs a string value with localStorage (same pattern as legacy `STORAGE_KEYS.listView`).
 */
export function useLocalStorage(key, initialValue) {
  const get = useCallback(() => {
    try {
      const v = localStorage.getItem(key);
      return v != null ? v : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeStorage(key, onStoreChange),
    get,
    get
  );

  const set = useCallback(
    (next) => {
      try {
        if (next == null) localStorage.removeItem(key);
        else localStorage.setItem(key, String(next));
        window.dispatchEvent(new Event(`${key}:local`));
      } catch {
        /* ignore */
      }
    },
    [key]
  );

  return [snapshot, set];
}
