import { useEffect, useState } from "react";
import type { WorkflowStage } from "@/domain/workflow";
import { AGENT_ACTIVITY_STEP_MS } from "@/domain/workflowActivity";

type ActivityStatus = "running" | "ready";

export interface WorkflowActivityState {
  stage: WorkflowStage;
  status: ActivityStatus;
  steps: string[];
  visibleStepCount: number;
  activeStep: string | null;
  progress: number;
  ready: boolean;
}

const activitySteps: Record<WorkflowStage, string[]> = {
  sourceDiscovery: [
    "Checking Workiva Data Hub for the entity register",
    "Reading the FY25 consolidated trial balance",
    "Searching governed records for the prior-year filing",
  ],
  entityScan: [
    "Extracting candidate reporting entities",
    "Reconstructing direct and indirect ownership paths",
    "Flagging ownership changes that require confirmation",
  ],
  setupProposal: [
    "Deriving the report period and statutory deadline",
    "Applying the readiness target and reminder policy",
    "Preparing the controller approval route",
  ],
  planning: [
    "Assigning expected forms to each affiliate",
    "Evaluating not-filing outcomes against the rule pack",
    "Preparing the governed scope proposal",
  ],
  mapping: [
    "Matching governed source fields to BE-11 requirements",
    "Comparing mapped values across connected systems",
    "Separating resolved variances from collection gaps",
  ],
  collection: [
    "Preparing field-level requests for data owners",
    "Attaching evidence requirements and due dates",
    "Checking connected-source coverage",
  ],
  validation: [
    "Running deterministic BEA edit checks",
    "Reconciling totals and ownership relationships",
    "Preparing the readiness report",
  ],
  forms: [
    "Populating the approved BE-11 forms",
    "Checking high-judgment fields and disclosures",
    "Preparing the human review set",
  ],
  approval: [
    "Assembling the final judgment ledger",
    "Binding evidence and resolved warnings to package v12",
    "Verifying the authorized approval gate",
  ],
  filing: [
    "Building the authorized BEA transmission package",
    "Verifying credentials and package integrity",
    "Staging the filing receipt workflow",
  ],
  complete: ["Preserving the filing receipt and durable project record"],
};

const STEP_DURATION_MS =
  import.meta.env.MODE === "test" ? 20 : AGENT_ACTIVITY_STEP_MS;

function readyState(stage: WorkflowStage): WorkflowActivityState {
  const steps = activitySteps[stage];
  return {
    stage,
    status: "ready",
    steps,
    visibleStepCount: steps.length,
    activeStep: null,
    progress: 100,
    ready: true,
  };
}

function runningState(stage: WorkflowStage): WorkflowActivityState {
  const steps = activitySteps[stage];
  return {
    stage,
    status: "running",
    steps,
    visibleStepCount: 0,
    activeStep: steps[0],
    progress: 8,
    ready: false,
  };
}

export function useWorkflowActivity(
  stage: WorkflowStage | null,
  animate: boolean,
) {
  const [activity, setActivity] = useState<WorkflowActivityState | null>(null);

  useEffect(() => {
    if (!stage) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (!animate || reduceMotion || stage === "complete") {
      const timer = window.setTimeout(() => setActivity(readyState(stage)), 0);
      return () => window.clearTimeout(timer);
    }

    const steps = activitySteps[stage];
    const timers = [
      window.setTimeout(() => setActivity(runningState(stage)), 0),
      ...steps.map((_, index) =>
        window.setTimeout(
          () => {
            const visibleStepCount = index + 1;
            const ready = visibleStepCount === steps.length;
            setActivity({
              stage,
              status: ready ? "ready" : "running",
              steps,
              visibleStepCount,
              activeStep: ready ? null : steps[visibleStepCount],
              progress: ready
                ? 100
                : Math.round((visibleStepCount / steps.length) * 88),
              ready,
            });
          },
          STEP_DURATION_MS * (index + 1),
        ),
      ),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [animate, stage]);

  if (!stage) return null;
  if (activity?.stage === stage) return activity;
  return animate && stage !== "complete"
    ? runningState(stage)
    : readyState(stage);
}
