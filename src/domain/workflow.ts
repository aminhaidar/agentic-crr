export const WORKFLOW_STAGES = [
  "sourceDiscovery",
  "entityScan",
  "setupProposal",
  "planning",
  "mapping",
  "collection",
  "validation",
  "forms",
  "approval",
  "filing",
  "complete",
] as const;

export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];
export type WorkflowTransitionSource = "operator" | "manual";

export interface WorkflowEvent {
  id: string;
  from: WorkflowStage;
  to: WorkflowStage;
  source: WorkflowTransitionSource;
  occurredAt: string;
}

export interface WorkflowSnapshot {
  projectId: string;
  reportType: string;
  stage: WorkflowStage;
  version: number;
  updatedAt: string;
  events: WorkflowEvent[];
}

export function nextWorkflowStage(stage: WorkflowStage): WorkflowStage {
  const index = WORKFLOW_STAGES.indexOf(stage);
  return WORKFLOW_STAGES[index + 1] ?? "complete";
}
