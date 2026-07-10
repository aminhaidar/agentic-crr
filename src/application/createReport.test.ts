import { describe, expect, it } from "vitest";
import { REPORT_TYPES } from "@/fixtures/reportTypes";
import { createReport, slugReportId } from "./createReport";

const be11 = REPORT_TYPES[0];

describe("slugReportId", () => {
  it("creates stable URL-safe identifiers", () => {
    expect(slugReportId(" BE-11 · FY25 ")).toBe("be-11-fy25");
    expect(slugReportId("Country-by-Country / 2026")).toBe(
      "country-by-country-2026",
    );
  });
});

describe("createReport", () => {
  it("creates the complete report, dashboard, and deadline model", () => {
    const result = createReport(
      {
        name: "BE-11 · FY26",
        reportType: be11,
        startDate: "2026-04-01",
        dueDate: "2026-07-10",
        dataCollectionDueDate: "2026-06-19",
      },
      { existingIds: new Set(), sequence: 0 },
    );

    expect(result.report).toMatchObject({
      id: "be-11-fy26",
      code: "BE-11",
      title: "BE-11 · FY26",
      kind: "filing",
      status: "active",
      pct: 0,
      updatedSort: -1,
      startDate: "2026-04-01",
      dueDate: "2026-07-10",
      dataDueDate: "2026-06-19",
      forms: { unit: "affiliate", total: 0, items: [] },
    });
    expect(result.dashboard.agents[0]).toMatchObject({
      n: "Obligation Scout",
      status: "q",
    });
    expect(result.deadline).toMatchObject({
      id: "be-11-fy26",
      label: "BE-11 · FY26",
      date: { y: 2026, m: 6, d: 10 },
      dateLabel: "Fri, Jul 10",
    });
    expect(result.nextSequence).toBe(-1);
  });

  it("uses the report type when the title is blank", () => {
    const result = createReport(
      {
        name: "   ",
        reportType: be11,
        startDate: null,
        dueDate: null,
        dataCollectionDueDate: null,
      },
      { existingIds: new Set(), sequence: -4 },
    );

    expect(result.report.title).toBe("BE-11 report");
    expect(result.report.id).toBe("be-11-report");
    expect(result.deadline).toBeNull();
    expect(result.nextSequence).toBe(-5);
  });

  it("creates deterministic unique identifiers for collisions", () => {
    const now = () => 123456;
    const existingIds = new Set([
      "be-11-fy26",
      "be-11-fy26-123456",
      "be-11-fy26-123456-2",
    ]);

    const result = createReport(
      {
        name: "BE-11 FY26",
        reportType: be11,
        startDate: null,
        dueDate: null,
        dataCollectionDueDate: null,
      },
      { existingIds, sequence: 0, now },
    );

    expect(result.report.id).toBe("be-11-fy26-123456-3");
  });

  it("escapes user-controlled text in generated history markup", () => {
    const result = createReport(
      {
        name: `<img src=x onerror="alert(1)">`,
        reportType: be11,
        startDate: null,
        dueDate: "not-a-date",
        dataCollectionDueDate: null,
      },
      { existingIds: new Set(), sequence: 0 },
    );

    expect(result.report.history[0].html).toContain(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
    expect(result.report.history[0].html).not.toContain("<img");
    expect(result.deadline).toBeNull();
  });
});
