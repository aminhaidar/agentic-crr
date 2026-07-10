import { describe, expect, it } from "vitest";
import { REPORT_TYPES } from "@/fixtures/reportTypes";
import { InMemoryReportRepository } from "./InMemoryReportRepository";

function createState() {
  const dashboards: Record<string, unknown> = {
    "existing-report": { agents: [] },
  };
  const deadlines: Array<{ id: string }> = [{ id: "existing-report" }];

  return {
    sessions: [
      {
        id: "existing-report",
        code: "BE-11",
        title: "Existing report",
        sub: "Direct Investment Abroad · BEA",
        kind: "filing",
        pinned: false,
        status: "active",
        pct: 25,
        updated: "2h ago",
        updatedSort: 2,
        dueDate: "2026-07-10",
        waitingOn: { who: "sc" },
        resolve: { newStatus: "active" },
      },
      {
        id: "chat-session",
        code: "AI",
        title: "Portfolio question",
        sub: "Ad-hoc question",
        kind: "chat",
        status: "done",
        pct: null,
      },
    ],
    dashboards,
    deadlines,
  };
}

describe("InMemoryReportRepository", () => {
  it("lists reports without leaking chat sessions", async () => {
    const repository = new InMemoryReportRepository({
      state: createState(),
      reportTypes: REPORT_TYPES,
    });

    await expect(repository.list()).resolves.toEqual([
      {
        id: "existing-report",
        code: "BE-11",
        title: "Existing report",
        subtitle: "Direct Investment Abroad · BEA",
        status: "active",
        percentComplete: 25,
        dueDate: "2026-07-10",
      },
    ]);
  });

  it("creates a report across the shared session, dashboard, and deadline state", async () => {
    const state = createState();
    const repository = new InMemoryReportRepository({
      state,
      reportTypes: REPORT_TYPES,
      now: () => 123,
    });

    const created = await repository.create({
      name: "BE-577 · Q3",
      reportTypeCode: "BE-577",
      startDate: "2026-07-01",
      dueDate: "2026-10-03",
      dataCollectionDueDate: "2026-09-30",
    });

    expect(created).toEqual({ id: "be-577-q3", title: "BE-577 · Q3" });
    expect(state.sessions[0]).toMatchObject({
      id: "be-577-q3",
      code: "BE-577",
      dueDate: "2026-10-03",
    });
    expect(state.dashboards["be-577-q3"]).toBeDefined();
    expect(state.deadlines).toContainEqual(
      expect.objectContaining({ id: "be-577-q3" }),
    );
  });

  it("rejects unknown report type codes with a stable error", async () => {
    const repository = new InMemoryReportRepository({
      state: createState(),
      reportTypes: REPORT_TYPES,
    });

    await expect(
      repository.create({
        name: "Unknown report",
        reportTypeCode: "UNKNOWN",
        startDate: null,
        dueDate: null,
        dataCollectionDueDate: null,
      }),
    ).rejects.toMatchObject({ code: "REPORT_TYPE_NOT_FOUND" });
  });

  it("updates pinning and waiting state through report commands", async () => {
    const state = createState();
    const repository = new InMemoryReportRepository({
      state,
      reportTypes: REPORT_TYPES,
    });

    await repository.setPinned("existing-report", true);
    await repository.resolveWaiting("existing-report");

    expect(state.sessions[0]).toMatchObject({
      pinned: true,
      waitingOn: null,
      status: "active",
      updated: "just now",
      updatedSort: 0,
    });
    await expect(repository.setPinned("missing", true)).rejects.toMatchObject({
      code: "REPORT_NOT_FOUND",
    });
  });

  it("deletes all report-owned fixture state", async () => {
    const state = createState();
    const repository = new InMemoryReportRepository({
      state,
      reportTypes: REPORT_TYPES,
    });

    await repository.delete("existing-report");

    expect(state.sessions.map(({ id }) => id)).toEqual(["chat-session"]);
    expect(state.dashboards).not.toHaveProperty("existing-report");
    expect(state.deadlines).toEqual([]);
    await expect(repository.delete("missing")).rejects.toMatchObject({
      code: "REPORT_NOT_FOUND",
    });
  });
});
