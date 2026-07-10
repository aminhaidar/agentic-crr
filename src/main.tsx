import { createRoot } from "react-dom/client";
import App from "./App";
import "./global-styles";

// No StrictMode: the shell is injected as raw markup and driven imperatively by
// the ported engine, so double-invoked effects would re-inject an empty shell.
createRoot(document.getElementById("root")!).render(<App />);
