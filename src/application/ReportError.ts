export type ReportErrorCode =
  "REPORT_NOT_FOUND" | "REPORT_TYPE_NOT_FOUND" | "REPORT_WRITE_FAILED";

export class ReportError extends Error {
  constructor(
    readonly code: ReportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ReportError";
  }
}
