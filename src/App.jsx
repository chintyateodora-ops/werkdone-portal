import { useEffect, useRef } from "react";

export default function App() {
  const appRef = useRef(null);

  useEffect(() => {
    if (window.__WD_PORTAL_INIT) return;
    if (!appRef.current) return;

    import("./legacy/app.js").then((m) => {
      if (!window.__WD_PORTAL_INIT) {
        m.initPortal();
      }
    });
  }, []);

  return <div id="app" ref={appRef} aria-live="polite" />;
}
