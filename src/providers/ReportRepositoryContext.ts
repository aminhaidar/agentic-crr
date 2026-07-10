import { createContext, useContext } from "react";
import type { ReportRepository } from "@/application/ports/ReportRepository";

export const ReportRepositoryContext = createContext<ReportRepository | null>(
  null,
);

export function useReportRepository(): ReportRepository {
  const repository = useContext(ReportRepositoryContext);
  if (!repository) {
    throw new Error(
      "useReportRepository must be used inside ReportRepositoryProvider",
    );
  }
  return repository;
}
