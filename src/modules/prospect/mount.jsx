import { createRoot } from "react-dom/client";
import ProspectManagementPage from "../../pages/ProspectManagementPage.jsx";

let root = null;

export function mountProspectListReact() {
  const el = document.getElementById("react-prospect-list-mount");
  if (!el) return;
  if (!root) root = createRoot(el);
  root.render(<ProspectManagementPage />);
}

export function unmountProspectListReact() {
  if (!root) return;
  try {
    root.unmount();
  } catch {
    /* ignore */
  }
  root = null;
}
