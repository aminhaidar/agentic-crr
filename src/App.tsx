import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import shellHtml from "./shell.html?raw";
import { initLegacy, reportRepository } from "./engine/legacy";
import { ChromeEnhancements } from "./components/shell/ChromeEnhancements";
import { operatorAgent } from "./infrastructure/agent/operatorAgent";
import { workflowRepository } from "./infrastructure/workflow/workflowRepository";
import { OperatorAgentProvider } from "./providers/OperatorAgentProvider";
import { ReportRepositoryProvider } from "./providers/ReportRepositoryProvider";
import { WorkflowRepositoryProvider } from "./providers/WorkflowRepositoryProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <ReportRepositoryProvider repository={reportRepository}>
        <WorkflowRepositoryProvider repository={workflowRepository}>
          <OperatorAgentProvider agent={operatorAgent}>
            <div
              className="operator-shell"
              style={{ height: "100%" }}
              dangerouslySetInnerHTML={{ __html: shellHtml }}
            />
            <ChromeEnhancements />
          </OperatorAgentProvider>
        </WorkflowRepositoryProvider>
      </ReportRepositoryProvider>
    </QueryClientProvider>
  );
}
