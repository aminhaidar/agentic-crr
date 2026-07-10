import type { ReportType } from "@/domain/report";

export const REPORT_TYPES = [
  {
    code: "BE-11",
    name: "Annual Survey of U.S. Direct Investment Abroad",
    sub: "Direct Investment Abroad · BEA",
    unit: "affiliate",
    formCode: "BE-11B",
    formNote: "One BE-11 form per foreign affiliate in scope.",
  },
  {
    code: "BE-577",
    name: "Quarterly Survey of Transactions",
    sub: "Quarterly Transactions · BEA",
    unit: "affiliate",
    formCode: "BE-577",
    formNote: "One form per affiliate with reportable transactions.",
  },
  {
    code: "BE-125",
    name: "Quarterly Survey of Services & IP Transactions",
    sub: "Services & IP Transactions · BEA",
    unit: "affiliate",
    formCode: "BE-125",
    formNote: "One form per affiliate with services/IP transactions.",
  },
  {
    code: "CbCR",
    name: "Country-by-Country Report (Form 8975)",
    sub: "Form 8975 · IRS/OECD",
    unit: "tax jurisdiction",
    formCode: "8975 · Sch A",
    formNote: "One schedule per tax jurisdiction where the group operates.",
  },
  {
    code: "SF-425",
    name: "Federal Financial Report",
    sub: "Federal Financial Report · GSA",
    unit: "federal award",
    formCode: "SF-425",
    formNote: "One form per federal award.",
  },
] as const satisfies readonly ReportType[];
