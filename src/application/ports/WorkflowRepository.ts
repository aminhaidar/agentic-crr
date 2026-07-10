import type {
  WorkflowSnapshot,
  WorkflowStage,
  WorkflowTransitionSource,
} from "@/domain/workflow";

export interface WorkflowRepository {
  get(projectId: string): Promise<WorkflowSnapshot | null>;
  start(reportType: string): Promise<WorkflowSnapshot>;
  advance(
    projectId: string,
    expectedStage: WorkflowStage,
    source: WorkflowTransitionSource,
  ): Promise<WorkflowSnapshot>;
  setStage(
    projectId: string,
    stage: WorkflowStage,
    source: WorkflowTransitionSource,
  ): Promise<WorkflowSnapshot>;
}
