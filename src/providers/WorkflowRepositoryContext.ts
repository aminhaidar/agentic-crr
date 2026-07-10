import { createContext, useContext } from "react";
import type { WorkflowRepository } from "@/application/ports/WorkflowRepository";

export const WorkflowRepositoryContext =
  createContext<WorkflowRepository | null>(null);

export function useWorkflowRepository() {
  const repository = useContext(WorkflowRepositoryContext);
  if (!repository) {
    throw new Error(
      "useWorkflowRepository must be used inside WorkflowRepositoryProvider.",
    );
  }
  return repository;
}
