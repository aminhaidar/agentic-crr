// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReportRepository } from "@/application/ports/ReportRepository";
import { ReportRepositoryProvider } from "@/providers/ReportRepositoryProvider";
import { NewReportDialog } from "./NewReportDialog";

const reportType = {
  code: "BE-11",
  name: "Annual Survey",
  sub: "Direct Investment Abroad",
  unit: "affiliate",
  formCode: "BE-11B",
  formNote: "One form per affiliate.",
};

describe("NewReportDialog", () => {
  let repository: ReportRepository;
  let queryClient: QueryClient;

  afterEach(cleanup);

  beforeEach(() => {
    repository = {
      listTypes: vi.fn(async () => [reportType]),
      list: vi.fn(async () => []),
      create: vi.fn(async () => ({
        id: "be-11-fy26",
        title: "BE-11 · FY26",
      })),
      setPinned: vi.fn(async () => undefined),
      resolveWaiting: vi.fn(async () => undefined),
      delete: vi.fn(async () => undefined),
    };
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    window.__OP_DATA = {
      OB_TYPES: {},
      notifications: [],
      sessions: [],
    };
    window.__onReportCreated = vi.fn();
    window.showToast = vi.fn();
  });

  function renderDialog({
    open = true,
    onOpenChange = vi.fn(),
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } = {}) {
    return render(
      <QueryClientProvider client={queryClient}>
        <ReportRepositoryProvider repository={repository}>
          <NewReportDialog open={open} onOpenChange={onOpenChange} />
        </ReportRepositoryProvider>
      </QueryClientProvider>,
    );
  }

  it("focuses the report name when opened", async () => {
    renderDialog();

    await waitFor(() =>
      expect(screen.getByLabelText("Report name")).toHaveFocus(),
    );
  });

  it("closes only after the repository accepts submission", async () => {
    const onOpenChange = vi.fn();
    repository.create = vi.fn(async () => {
      throw new Error("write failed");
    });
    const { rerender } = renderDialog({ onOpenChange });

    fireEvent.change(screen.getByLabelText("Report name"), {
      target: { value: "BE-11 · FY26" },
    });
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-04-01" },
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-07-10" },
    });
    fireEvent.change(screen.getByLabelText("Data collection due date"), {
      target: { value: "2026-06-19" },
    });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Create report" }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Create report" }));
    await waitFor(() =>
      expect(repository.create).toHaveBeenCalledWith({
        name: "BE-11 · FY26",
        reportTypeCode: "BE-11",
        startDate: "2026-04-01",
        dueDate: "2026-07-10",
        dataCollectionDueDate: "2026-06-19",
      }),
    );
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(window.showToast).toHaveBeenCalledWith(
      "Unable to create the report. Please try again.",
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Create report" }),
      ).toBeEnabled(),
    );

    repository.create = vi.fn(async () => ({
      id: "be-11-fy26",
      title: "BE-11 · FY26",
    }));
    rerender(
      <QueryClientProvider client={queryClient}>
        <ReportRepositoryProvider repository={repository}>
          <NewReportDialog open onOpenChange={onOpenChange} />
        </ReportRepositoryProvider>
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Create report" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(window.__onReportCreated).toHaveBeenCalledWith({
      id: "be-11-fy26",
      title: "BE-11 · FY26",
    });
  });

  it("resets controlled values after closing", () => {
    const onOpenChange = vi.fn();
    const { rerender } = renderDialog({ onOpenChange });

    fireEvent.change(screen.getByLabelText("Report name"), {
      target: { value: "Temporary title" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    rerender(
      <QueryClientProvider client={queryClient}>
        <ReportRepositoryProvider repository={repository}>
          <NewReportDialog open={false} onOpenChange={onOpenChange} />
        </ReportRepositoryProvider>
      </QueryClientProvider>,
    );
    rerender(
      <QueryClientProvider client={queryClient}>
        <ReportRepositoryProvider repository={repository}>
          <NewReportDialog open onOpenChange={onOpenChange} />
        </ReportRepositoryProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByLabelText("Report name")).toHaveValue("");
  });
});
