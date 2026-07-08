export {};

export interface ReportType {
  code: string;
  name: string;
  sub: string;
  unit: string;
  formCode: string;
  formNote: string;
}

export interface OpLibAction {
  fn: "session" | "artifact" | "schedule";
  arg: string | number;
  arg2: number;
}
export interface OpLibRow {
  icon: string;
  title: string;
  badge: { label: string; cls: string } | null;
  sub: string;
  time: string;
  act: OpLibAction;
}
export interface OpHomeData {
  quick: Array<{ key: string; code: string; primary: boolean }>;
  more: Array<{ key: string; code: string; short: string }>;
  prompts: Array<{ key: string; label: string }>;
  lib: { conversations: OpLibRow[]; artifacts: OpLibRow[]; schedules: OpLibRow[] };
  icons: { spark: string; op: string; chev: string };
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
    // Operator home (React <OperatorHome/>) reads fixtures + drives engine actions.
    opHomeData: () => OpHomeData;
    operatorLaunch: (txt: string, type: string) => void;
    goToNewSessionWithMessage: (text: string, key: string) => void;
    detectReportType: (t: string) => string | null;
    opStarter: (key: string) => void;
    pickOther: (key: string) => void;
    openSessionById: (id: string) => void;
    openArtifact: (group: string, idx: number) => void;
    openScheduleModal: (idx: number) => void;
    // Bridge so React can own the New Report modal while inline handlers still fire it.
    __openNewReport?: () => void;
    // Read-only fixture data exposed by the engine.
    __OP_DATA?: {
      REPORT_TYPES: ReportType[];
      OB_TYPES: Record<string, unknown>;
      notifications: Array<{ id: number; text: string; time: string; read: boolean; sessionId?: string }>;
      sessions: Array<Record<string, unknown>>;
    };
  }
}
