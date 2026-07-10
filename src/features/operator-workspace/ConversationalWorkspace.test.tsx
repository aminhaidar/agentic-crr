// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReportRepository } from "@/application/ports/ReportRepository";
import { MockOperatorAgent } from "@/infrastructure/agent/mockOperatorAgent";
import { InMemoryWorkflowRepository } from "@/infrastructure/workflow/InMemoryWorkflowRepository";
import { OperatorAgentProvider } from "@/providers/OperatorAgentProvider";
import { ReportRepositoryProvider } from "@/providers/ReportRepositoryProvider";
import { WorkflowRepositoryProvider } from "@/providers/WorkflowRepositoryProvider";
import { ConversationalWorkspace } from "./ConversationalWorkspace";

const report = {
  id: "be11-fy25",
  code: "BE-11",
  title: "BE-11 · FY25",
  subtitle: "Direct Investment Abroad · BEA",
  status: "needs_you",
  percentComplete: 92,
  dueDate: "2026-07-10",
};

describe("ConversationalWorkspace", () => {
  let repository: ReportRepository;
  let workflowRepository: InMemoryWorkflowRepository;
  let queryClient: QueryClient;

  beforeEach(() => {
    repository = {
      listTypes: vi.fn(async () => []),
      list: vi.fn(async () => [report]),
      create: vi.fn(async () => ({ id: report.id, title: report.title })),
      setPinned: vi.fn(async () => undefined),
      resolveWaiting: vi.fn(async () => undefined),
      delete: vi.fn(async () => undefined),
    };
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    workflowRepository = new InMemoryWorkflowRepository();
    window.openProject = vi.fn();
    window.openManualProject = vi.fn();
    window.openManualReport = vi.fn();
    window.go = vi.fn();
    window.showToast = vi.fn();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.body.className = "";
  });

  function renderWorkspace() {
    return render(
      <QueryClientProvider client={queryClient}>
        <ReportRepositoryProvider repository={repository}>
          <WorkflowRepositoryProvider repository={workflowRepository}>
            <OperatorAgentProvider agent={new MockOperatorAgent()}>
              <ConversationalWorkspace />
            </OperatorAgentProvider>
          </WorkflowRepositoryProvider>
        </ReportRepositoryProvider>
      </QueryClientProvider>,
    );
  }

  it("opens a resumable report thread with structured readiness", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: true,
        sessionId: "be11-fy25",
      });
    });

    expect(await screen.findByText("Welcome back, Julie")).toBeVisible();
    expect(screen.getByText("Ran filing workflow")).toBeVisible();
    expect(screen.getByText("Ready for approval")).toBeVisible();
    expect(screen.getByRole("button", { name: "Show preview" })).toBeVisible();
    expect(document.body).toHaveClass("conversation-session");
    expect(repository.list).toHaveBeenCalledOnce();
  });

  it("uses one session-history control and preserves manual access", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: true,
        sessionId: "be11-fy25",
      });
    });

    const historyToggle = await screen.findByRole("button", {
      name: "Show conversation history",
    });
    fireEvent.click(historyToggle);
    expect(
      screen.getByRole("button", { name: "Hide conversation history" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /manual workspace/i }));
    expect(window.openManualReport).toHaveBeenCalledWith(
      "be11",
      "review",
      "be11-fy25",
      "approval",
    );
    expect(document.body).not.toHaveClass("conversation-session");
  });

  it("returns directly to the Operator launchpad", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: true,
        sessionId: "be11-fy25",
      });
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Operator home" }),
    );

    expect(window.go).toHaveBeenLastCalledWith("home");
    expect(document.body).not.toHaveClass("conversation-session");
  });

  it("resizes and persists the docked preview", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: false,
        sessionId: null,
      });
    });

    expect(
      screen.queryByRole("separator", { name: "Resize preview" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show preview" })).toBeVisible();
    fireEvent.click(
      await screen.findByRole("button", { name: "Review source discovery" }),
    );

    const separator = screen.getByRole("separator", {
      name: "Resize preview",
    });
    expect(
      screen.getByRole("button", { name: "Hide preview" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(separator, { key: "ArrowLeft" });

    expect(separator).toHaveAttribute("aria-valuenow", "476");
    expect(window.localStorage.getItem("operator.previewWidth.v1")).toBe("476");
  });

  it("records an explicit approval in the durable thread", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: true,
        sessionId: "be11-fy25",
      });
    });

    fireEvent.click(
      await screen.findByRole("button", { name: "Review judgment ledger" }),
    );
    expect(screen.getByRole("button", { name: "Hide preview" })).toBeVisible();
    expect(
      screen.queryByText("Final package approved"),
    ).not.toBeInTheDocument();

    const approvalButtons = await screen.findAllByRole("button", {
      name: "Approve final package",
    });
    fireEvent.click(approvalButtons[0]);

    await waitFor(() =>
      expect(screen.getByText("Final package approved")).toBeVisible(),
    );
    await expect(workflowRepository.get("be11-fy25")).resolves.toMatchObject({
      stage: "filing",
    });
  });

  it("does not delay actions when reduced motion is requested", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );
    renderWorkspace();

    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: false,
        sessionId: null,
      });
    });

    expect(
      (
        await screen.findAllByRole("button", {
          name: "Confirm sources & continue",
        })
      )[0],
    ).toBeVisible();
    expect(screen.queryByText("Running")).not.toBeInTheDocument();
  });

  it("keeps an intentionally closed preview closed for compact stages", async () => {
    renderWorkspace();
    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: false,
        sessionId: null,
      });
    });

    fireEvent.click(
      (
        await screen.findAllByRole("button", {
          name: "Confirm sources & continue",
        })
      )[0],
    );
    expect(
      await screen.findByRole("button", { name: "Hide preview" }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Hide preview" }));

    fireEvent.click(
      (await screen.findAllByRole("button", { name: "Confirm entities" }))[0],
    );
    await screen.findAllByText("Confirm the project setup");
    expect(screen.getByRole("button", { name: "Show preview" })).toBeVisible();
  });

  it("starts BE-11 as a guided session with a live preview", async () => {
    renderWorkspace();

    await act(async () => {
      window.__startConversationalProject?.({
        type: "be11",
        resume: false,
        sessionId: "be11-fy25",
      });
    });

    expect(
      screen.getAllByText("Review discovered source data")[0],
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Show preview" })).toBeVisible();
    expect(screen.getAllByText("Running")[0]).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Confirm sources & continue" }),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByText("Trial Balance · Fiscal Year 2025"),
    ).toBeVisible();
    expect(await screen.findByText("Prior-year filings")).toBeVisible();
    expect(
      (
        await screen.findAllByRole("button", {
          name: "Confirm sources & continue",
        })
      )[0],
    ).toBeVisible();
    expect(window.go).toHaveBeenCalledWith("home");

    fireEvent.click(
      (
        await screen.findAllByRole("button", {
          name: "Confirm sources & continue",
        })
      )[0],
    );
    await waitFor(() =>
      expect(
        screen.getAllByText("Confirm the reporting entities")[0],
      ).toBeVisible(),
    );
    expect(screen.getByRole("button", { name: "Hide preview" })).toBeVisible();

    const remainingStages = [
      ["Confirm entities", "Confirm the project setup"],
      ["Confirm setup & plan", "Review the proposed scope"],
      ["Approve scope & collect", "Review field mapping and coverage"],
      ["Accept mapping & collect gaps", "Complete governed data collection"],
      [
        "Complete collection & validate",
        "Review validation and package readiness",
      ],
      ["Accept validation & review forms", "Complete the form review"],
      ["Mark forms reviewed", "Approve the final package"],
      ["Approve final package", "Authorize and transmit the filing"],
      ["File with BEA", "Filing complete"],
    ] as const;

    for (const [action, nextTitle] of remainingStages) {
      fireEvent.click(
        (await screen.findAllByRole("button", { name: action }))[0],
      );
      await waitFor(() =>
        expect(screen.getAllByText(nextTitle)[0]).toBeVisible(),
      );
    }
  });
});
