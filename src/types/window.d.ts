import type { CreateReportFormValues } from "@/domain/report";
import type { WorkflowStage } from "@/domain/workflow";
import type { FilingSnapshot } from "@/domain/filing";
import type { CreatedReportReference } from "@/application/ports/ReportRepository";

export {};

declare global {
  interface Window {
    // Engine handlers (subset used by React/shadcn surfaces).
    go: (view: string) => void;
    openProject?: (id: string) => void;
    openManualProject?: (id: string) => void;
    openManualReport?: (
      type: string,
      tab?: string,
      workflowId?: string | null,
      workflowStage?: WorkflowStage,
    ) => void;
    toggleWorkspaceNav?: () => void;
    createReport: (values?: CreateReportFormValues) => Promise<boolean>;
    openNewReportModal: () => void;
    closeModal: () => void;
    openReport: (type: string, seed?: unknown) => void;
    newReportFormNote: () => void;
    showToast: (msg: string) => void;
    // Bridge so React can own the New Report modal while inline handlers still fire it.
    __openNewReport?: () => void;
    __startConversationalProject?: (input: {
      type: string;
      resume: boolean;
      sessionId?: string | null;
    }) => void;
    __exitConversationalProject?: () => void;
    // Temporary presentation bridge while report screens remain in the legacy engine.
    __onReportCreated?: (report: CreatedReportReference) => void;
    // Operator filing bridge: read/drive the same real RPT the tabbed view uses.
    __opEnterFiling?: (id: string) => FilingSnapshot | null;
    __opFilingSnapshot?: () => FilingSnapshot | null;
    __opRevealManual?: (tab?: string) => void;
    __opFilingChanged?: (snapshot: FilingSnapshot | null) => void;
    // Bridge so the dark<->light navigation is played as an animated iris transition.
    __opThemeTransition?: (opts: { toDark: boolean; run: () => void }) => void;
    // Set by the Wdesk microfrontend entry so the shell can slim redundant chrome.
    __OP_EMBEDDED?: boolean;
    // Read-only fixture data exposed by the engine.
    __OP_DATA?: {
      OB_TYPES: Record<string, unknown>;
      notifications: Array<{
        id: number;
        text: string;
        time: string;
        read: boolean;
        sessionId?: string;
      }>;
      sessions: Array<Record<string, unknown>>;
    };
  }
}
