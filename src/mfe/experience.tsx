import {
  DrawerContentComponentV2,
  DrawerExperience,
} from "@workiva/drawer_experience_contribution";
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "../App";

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
            root = createRoot(container);
            root.render(
              <StrictMode>
                <div style={{ height: "100dvh", minHeight: 0 }}>
                  <App />
                </div>
              </StrictMode>,
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
