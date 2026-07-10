// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("boots the complete Operator launchpad", async () => {
    render(<App />);

    expect(await screen.findByText("Agentic CRR")).toBeVisible();
    expect(
      screen.getByText(/Good (morning|afternoon|evening), Julie/),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /Start report/i })).toBeVisible();

    window.toggleWorkspaceNav?.();
    expect(document.body).toHaveClass("collapsed");
    expect(
      screen.getByRole("button", { name: "Show navigation" }),
    ).toBeVisible();

    window.toggleWorkspaceNav?.();
    expect(document.body).not.toHaveClass("collapsed");
  });
});
