import type { WorkflowStage } from "./workflow";

/**
 * A live, read-only view of the real filing (`RPT`) the engine is driving.
 * The Operator conversational surface renders from this so it can never
 * contradict the tabbed view — they are the same filing.
 *
 * `null` count fields mean "not yet produced at this stage" (e.g. form counts
 * before scoping has run), distinct from a real zero.
 */
export interface FilingSnapshot {
  sessionId: string | null;
  type: string;
  title: string;
  stage: WorkflowStage | null;
  entities: {
    total: number | null;
    filing: number | null;
    notFiling: number | null;
    needsReview: number;
  };
  mapping: {
    mapped: number | null;
    low: number | null;
    gaps: number | null;
  };
  readiness: string | null;
  unlocked: Record<string, boolean>;
  status: string | null;
}
