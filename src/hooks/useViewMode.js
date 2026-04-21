import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const LIST_VIEW_KEY = "wd.listView";

/**
 * List vs kanban view with the same storage key as the legacy portal.
 */
export function useViewMode() {
  const [raw, setRaw] = useLocalStorage(LIST_VIEW_KEY, "");

  const view =
    String(raw || "")
      .trim()
      .toLowerCase() === "list"
      ? "list"
      : String(raw || "")
            .trim()
            .toLowerCase() === "kanban"
        ? "kanban"
        : null;

  const setView = useCallback(
    (v) => {
      if (v === "list" || v === "kanban") setRaw(v);
    },
    [setRaw]
  );

  return { view, setView };
}
