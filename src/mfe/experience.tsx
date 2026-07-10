import {
  DrawerContentComponentV2,
  DrawerExperience,
} from "@workiva/drawer_experience_contribution";
import { createRoot, type Root } from "react-dom/client";
import App from "../App";
// The MFE entry bypasses main.tsx, so it must pull the global stylesheets into
// its own module graph — otherwise the app renders unstyled in the Wdesk drawer.
import "../global-styles";

/**
 * Mounts the existing Agentic CRR app into the Wdesk drawer the frame provides.
 * `App` already owns its providers (QueryClient + repositories + OperatorAgent),
 * so it drops in unchanged. Running inside the frame means the session is real:
 * the logged-in user comes from Wdesk, and the HttpOperatorAgent can use it once
 * VITE_OPERATOR_AGENT_URL is set.
 *
 * NOTE: `App` still renders its own prototype sidebar/shell. Inside Wdesk that
 * sits within the frame's chrome; collapsing the app's own nav when embedded is
 * a follow-up refinement.
 */
export class AgenticCrrExperience extends DrawerExperience {
  load(): Promise<void> {
    let root: Root | null = null;

    super.addComponent(
      new DrawerContentComponentV2({
        includeContainerPadding: false,
        content: {
          mount: (container: Element) => {
            // Tell the engine it's inside the Wdesk frame so it can slim chrome
            // that the frame already provides (brand, redundant nav). Set before
            // initLegacy runs (App's effect) so the first render is embedded-aware.
            window.__OP_EMBEDDED = true;
            root = createRoot(container);
            // No StrictMode: like main.tsx, the engine injects the shell as raw
            // markup and drives it imperatively — double-invoked effects would
            // re-inject an empty shell.
            root.render(
              <div style={{ height: "100dvh", minHeight: 0 }}>
                <App />
              </div>,
            );
          },
          unmount: () => {
            root?.unmount();
            root = null;
          },
        },
      }),
    );

    return Promise.resolve();
  }
}
