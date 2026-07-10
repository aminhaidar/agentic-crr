import type { CreateReportFormValues, ReportType } from "@/domain/report";

export interface ReportSummary {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  status: string;
  percentComplete: number | null;
  dueDate: string | null;
}

export interface CreatedReportReference {
  id: string;
  title: string;
}

/**
 * Backend-neutral persistence boundary for reports.
 *
 * The prototype uses an in-memory implementation. A production implementation
 * can call tRPC or another versioned API without changing React or domain code.
 */
export interface ReportRepository {
  listTypes(): Promise<readonly ReportType[]>;
  list(): Promise<readonly ReportSummary[]>;
  create(values: CreateReportFormValues): Promise<CreatedReportReference>;
  setPinned(id: string, pinned: boolean): Promise<void>;
  resolveWaiting(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
