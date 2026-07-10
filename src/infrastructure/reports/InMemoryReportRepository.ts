import { createReport } from "@/application/createReport";
import { ReportError, type ReportErrorCode } from "@/application/ReportError";
import type {
  CreatedReportReference,
  ReportRepository,
  ReportSummary,
} from "@/application/ports/ReportRepository";
import type {
  CreatedReport,
  CreateReportFormValues,
  ReportDashboardSeed,
  ReportDeadline,
  ReportType,
} from "@/domain/report";

interface LegacySession {
  id: string;
  code: string;
  title: string;
  sub: string;
  kind: string;
  pinned?: boolean;
  status: string;
  pct: number | null;
  updated?: string;
  updatedSort?: number;
  dueDate?: string | null;
  waitingOn?: unknown;
  resolve?: {
    newStatus?: string;
  };
}

interface MutableReportState {
  sessions: Array<LegacySession | CreatedReport>;
  dashboards: Record<string, unknown | ReportDashboardSeed>;
  deadlines: Array<{ id: string } | ReportDeadline>;
}

export interface InMemoryReportRepositoryOptions {
  state: MutableReportState;
  reportTypes: readonly ReportType[];
  initialSequence?: number;
  now?: () => number;
}

function failure(code: ReportErrorCode, message: string): ReportError {
  return new ReportError(code, message);
}

/**
 * Transitional adapter over the prototype's mutable fixture state.
 *
 * Keeping all writes here gives the current UI one source of truth while making
 * the eventual tRPC/API adapter a direct replacement for this class.
 */
export class InMemoryReportRepository implements ReportRepository {
  readonly #state: MutableReportState;
  readonly #reportTypes: readonly ReportType[];
  readonly #now: () => number;
  #sequence: number;

  constructor(options: InMemoryReportRepositoryOptions) {
    this.#state = options.state;
    this.#reportTypes = options.reportTypes;
    this.#sequence = options.initialSequence ?? 0;
    this.#now = options.now ?? Date.now;
  }

  async listTypes(): Promise<readonly ReportType[]> {
    return this.#reportTypes;
  }

  async list(): Promise<readonly ReportSummary[]> {
    return this.#state.sessions
      .filter((session) => session.kind === "filing")
      .map((session) => ({
        id: session.id,
        code: session.code,
        title: session.title,
        subtitle: session.sub,
        status: session.status,
        percentComplete: session.pct,
        dueDate: session.dueDate ?? null,
      }));
  }

  async create(
    values: CreateReportFormValues,
  ): Promise<CreatedReportReference> {
    const reportType = this.#reportTypes.find(
      ({ code }) => code === values.reportTypeCode,
    );
    if (!reportType) {
      throw failure(
        "REPORT_TYPE_NOT_FOUND",
        `Unsupported report type: ${values.reportTypeCode}`,
      );
    }

    const result = createReport(
      {
        name: values.name,
        reportType,
        startDate: values.startDate,
        dueDate: values.dueDate,
        dataCollectionDueDate: values.dataCollectionDueDate,
      },
      {
        existingIds: new Set(this.#state.sessions.map(({ id }) => id)),
        sequence: this.#sequence,
        now: this.#now,
      },
    );

    this.#sequence = result.nextSequence;
    this.#state.sessions.unshift(result.report);
    this.#state.dashboards[result.report.id] = result.dashboard;
    if (result.deadline) this.#state.deadlines.push(result.deadline);

    return {
      id: result.report.id,
      title: result.report.title,
    };
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    const report = this.#findReport(id);
    report.pinned = pinned;
  }

  async resolveWaiting(id: string): Promise<void> {
    const report = this.#findReport(id);
    const nextStatus =
      "resolve" in report ? report.resolve?.newStatus : undefined;
    report.waitingOn = null;
    report.status = nextStatus ?? "active";
    report.updated = "just now";
    report.updatedSort = 0;
  }

  async delete(id: string): Promise<void> {
    const index = this.#state.sessions.findIndex(
      (session) => session.id === id && session.kind === "filing",
    );
    if (index === -1) {
      throw failure("REPORT_NOT_FOUND", `Report not found: ${id}`);
    }

    this.#state.sessions.splice(index, 1);
    delete this.#state.dashboards[id];

    for (let index = this.#state.deadlines.length - 1; index >= 0; index -= 1) {
      if (this.#state.deadlines[index].id === id) {
        this.#state.deadlines.splice(index, 1);
      }
    }
  }

  #findReport(id: string): LegacySession | CreatedReport {
    const report = this.#state.sessions.find(
      (session) => session.id === id && session.kind === "filing",
    );
    if (!report) {
      throw failure("REPORT_NOT_FOUND", `Report not found: ${id}`);
    }
    return report;
  }
}
