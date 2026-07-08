import { useEffect } from "react";
import shellHtml from "./shell.html?raw";
import { initLegacy } from "./engine/legacy";
import { ChromeEnhancements } from "./components/shell/ChromeEnhancements";

/**
 * The Operator shell is rendered from the prototype's exact markup so the DOM,
 * inline SVGs, ids/classes, and inline handlers the ported engine depends on
 * are preserved byte-for-byte (guaranteeing identical styling + behavior).
 *
 * shadcn/ui is the design system: its theme tokens are wired to the prototype's
 * tokens (tailwind.config.ts) and its primitives back the React-level chrome
 * layered on top in <ChromeEnhancements/>.
 */
export default function App() {
  useEffect(() => {
    initLegacy();
    // Re-point the engine's modal handler to the React + shadcn Dialog. This
    // runs after ChromeEnhancements' effect (child effects fire first), so the
    // bridge is already installed and inline onclick handlers hit the new modal.
    window.openNewReportModal = () => window.__openNewReport?.();
  }, []);

  return (
    <>
      <div
        className="operator-shell"
        style={{ height: "100%" }}
        dangerouslySetInnerHTML={{ __html: shellHtml }}
      />
      <ChromeEnhancements />
    </>
  );
}
