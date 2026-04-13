
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { IndividualProfileProvider } from "./context/IndividualProfileContext.tsx";

  createRoot(document.getElementById("root")!).render(
    <IndividualProfileProvider>
      <App />
    </IndividualProfileProvider>
  );
  