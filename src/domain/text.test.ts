import { describe, expect, it } from "vitest";
import { detectReportType, escapeHtml } from "./text";

describe("detectReportType", () => {
  it.each([
    ["Start a BE-11 for fiscal year 2025", "be11"],
    ["Open the be 577 quarterly transaction report", "be577"],
    ["Direct investment filing", "be11"],
    ["Report 577", "be577"],
  ] as const)("maps %j to %s", (input, expected) => {
    expect(detectReportType(input)).toBe(expected);
  });

  it("returns null for unsupported or empty input", () => {
    expect(detectReportType("Create a QFR-9")).toBeNull();
    expect(detectReportType(null)).toBeNull();
  });
});

describe("escapeHtml", () => {
  it("escapes text-significant and attribute-significant characters", () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)'>&`)).toBe(
      "&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;",
    );
  });

  it("normalizes nullish values to an empty string", () => {
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(null)).toBe("");
  });
});
