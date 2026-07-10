import type { PropsWithChildren } from "react";
import type { WorkflowRepository } from "@/application/ports/WorkflowRepository";
import { WorkflowRepositoryContext } from "./WorkflowRepositoryContext";

export function WorkflowRepositoryProvider({
  children,
  repository,
}: PropsWithChildren<{ repository: WorkflowRepository }>) {
  return (
    <WorkflowRepositoryContext.Provider value={repository}>
      {children}
    </WorkflowRepositoryContext.Provider>
  );
}
