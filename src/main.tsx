import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Loaded last so the prototype's design system wins over Tailwind's preflight.
import "./styles/prototype.css";
// Operator home theme layer (v0 / Unify-derived), scoped to `.ophome`.
import "./styles/operator-home.css";

// No StrictMode: the shell is injected as raw markup and driven imperatively by
// the ported engine, so double-invoked effects would re-inject an empty shell.
createRoot(document.getElementById("root")!).render(<App />);
