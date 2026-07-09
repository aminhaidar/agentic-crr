export {};

export interface ReportType {
  code: string;
  name: string;
  sub: string;
  unit: string;
  formCode: string;
  formNote: string;
}

declare global {
  interface Window {
    // Engine handlers (subset used by React/shadcn surfaces).
    go: (view: string) => void;
    createReport: () => void;
    openNewReportModal: () => void;
    closeModal: () => void;
    openReport: (type: string, seed?: unknown) => void;
    newReportFormNote: () => void;
    showToast: (msg: string) => void;
    // Bridge so React can own the New Report modal while inline handlers still fire it.
    __openNewReport?: () => void;
    // Bridge so the dark<->light navigation is played as an animated iris transition.
    __opThemeTransition?: (opts: { toDark: boolean; run: () => void }) => void;
    // Read-only fixture data exposed by the engine.
    __OP_DATA?: {
      REPORT_TYPES: ReportType[];
      OB_TYPES: Record<string, unknown>;
      notifications: Array<{ id: number; text: string; time: string; read: boolean; sessionId?: string }>;
      sessions: Array<Record<string, unknown>>;
    };
  }
}
