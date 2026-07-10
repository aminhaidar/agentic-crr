export interface ReportType {
  code: string;
  name: string;
  sub: string;
  unit: string;
  formCode: string;
  formNote: string;
}

export interface CreateReportInput {
  name: string;
  reportType: ReportType;
  startDate: string | null;
  dueDate: string | null;
  dataCollectionDueDate: string | null;
}

export interface CreateReportFormValues {
  name: string;
  reportTypeCode: string;
  startDate: string | null;
  dueDate: string | null;
  dataCollectionDueDate: string | null;
}

export interface CreatedReport {
  id: string;
  code: string;
  title: string;
  sub: string;
  kind: "filing";
  engine: "history";
  pinned: false;
  status: "active";
  pct: 0;
  people: ["dr"];
  updated: "just now";
  updatedSort: number;
  waitingOn: null;
  stagePhase: 0;
  startDate: string | null;
  dueDate: string | null;
  dataDueDate: string | null;
  forms: {
    unit: string;
    total: 0;
    items: [];
  };
  history: Array<{
    kind: "op";
    lvl: "recommend";
    html: string;
  }>;
}

export interface ReportDashboardSeed {
  agents: Array<{
    n: "Obligation Scout";
    out: "Queued — assessing scope from entity data";
    status: "q";
    art: null;
  }>;
  pending: [];
  attention: [];
}

export interface ReportDeadline {
  id: string;
  label: string;
  date: {
    y: number;
    m: number;
    d: number;
  };
  dateLabel: string;
  note: "0% ready · just created";
  sev: "grey";
}

export interface CreateReportResult {
  report: CreatedReport;
  dashboard: ReportDashboardSeed;
  deadline: ReportDeadline | null;
  nextSequence: number;
}
