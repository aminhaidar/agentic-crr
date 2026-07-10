import type {
  CreateReportInput,
  CreateReportResult,
  ReportDeadline,
} from "@/domain/report";
import { escapeHtml } from "@/domain/text";

export interface CreateReportContext {
  existingIds: ReadonlySet<string>;
  sequence: number;
  now?: () => number;
}

export function slugReportId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueReportId(
  base: string,
  existingIds: ReadonlySet<string>,
  now: () => number,
): string {
  if (!existingIds.has(base)) return base;

  const timestamped = `${base}-${now()}`;
  if (!existingIds.has(timestamped)) return timestamped;

  let suffix = 2;
  while (existingIds.has(`${timestamped}-${suffix}`)) suffix += 1;
  return `${timestamped}-${suffix}`;
}

function createDeadline(
  id: string,
  label: string,
  dueDate: string | null,
): ReportDeadline | null {
  if (!dueDate) return null;

  const date = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return {
    id,
    label,
    date: {
      y: date.getFullYear(),
      m: date.getMonth(),
      d: date.getDate(),
    },
    dateLabel: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    note: "0% ready · just created",
    sev: "grey",
  };
}

export function createReport(
  input: CreateReportInput,
  context: CreateReportContext,
): CreateReportResult {
  const { reportType } = input;
  const title = input.name.trim() || `${reportType.code} report`;
  const baseId = slugReportId(title) || reportType.code.toLowerCase();
  const id = uniqueReportId(
    baseId,
    context.existingIds,
    context.now ?? Date.now,
  );
  const nextSequence = context.sequence - 1;

  return {
    report: {
      id,
      code: reportType.code,
      title,
      sub: reportType.sub,
      kind: "filing",
      engine: "history",
      pinned: false,
      status: "active",
      pct: 0,
      people: ["dr"],
      updated: "just now",
      updatedSort: nextSequence,
      waitingOn: null,
      stagePhase: 0,
      startDate: input.startDate,
      dueDate: input.dueDate,
      dataDueDate: input.dataCollectionDueDate,
      forms: {
        unit: reportType.unit,
        total: 0,
        items: [],
      },
      history: [
        {
          kind: "op",
          lvl: "recommend",
          html: `<p><strong>${escapeHtml(title)}</strong> report created. I'll start at the front door — reading your entity data and prior filings to work out scope, then generate one <strong>${escapeHtml(reportType.formCode)}</strong> form per ${escapeHtml(reportType.unit)} in scope.</p>`,
        },
      ],
    },
    dashboard: {
      agents: [
        {
          n: "Obligation Scout",
          out: "Queued — assessing scope from entity data",
          status: "q",
          art: null,
        },
      ],
      pending: [],
      attention: [],
    },
    deadline: createDeadline(id, title, input.dueDate),
    nextSequence,
  };
}
