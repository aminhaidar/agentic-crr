export type SupportedReportType = "be11" | "be577";

export function detectReportType(input: unknown): SupportedReportType | null {
  const value = String(input ?? "").toLowerCase();

  if (/be[\s-]?577|\b577\b|quarterly transaction/.test(value)) return "be577";
  if (/be[\s-]?11|\bbe11\b|direct investment/.test(value)) return "be11";

  return null;
}

export function escapeHtml(input: unknown): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(input ?? "").replace(
    /[&<>"']/g,
    (character) => entities[character],
  );
}
