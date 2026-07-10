import type { ReactNode } from "react";
import type { ReportRepository } from "@/application/ports/ReportRepository";
import { ReportRepositoryContext } from "./ReportRepositoryContext";

export function ReportRepositoryProvider({
  repository,
  children,
}: {
  repository: ReportRepository;
  children: ReactNode;
}) {
  return (
    <ReportRepositoryContext.Provider value={repository}>
      {children}
    </ReportRepositoryContext.Provider>
  );
}
