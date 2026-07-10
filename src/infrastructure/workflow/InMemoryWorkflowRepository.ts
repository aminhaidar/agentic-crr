import type { WorkflowRepository } from "@/application/ports/WorkflowRepository";
import {
  nextWorkflowStage,
  type WorkflowSnapshot,
  type WorkflowStage,
  type WorkflowTransitionSource,
} from "@/domain/workflow";

function clone(snapshot: WorkflowSnapshot): WorkflowSnapshot {
  return {
    ...snapshot,
    events: snapshot.events.map((event) => ({ ...event })),
  };
}

export class InMemoryWorkflowRepository implements WorkflowRepository {
  readonly #workflows = new Map<string, WorkflowSnapshot>();
  #draftSequence = 1;

  constructor() {
    const now = new Date().toISOString();
    this.#workflows.set("be11-fy25", {
      projectId: "be11-fy25",
      reportType: "be11",
      stage: "approval",
      version: 1,
      updatedAt: now,
      events: [],
    });
  }

  async get(projectId: string) {
    const snapshot = this.#workflows.get(projectId);
    return snapshot ? clone(snapshot) : null;
  }

  async start(reportType: string) {
    const projectId = `${reportType}-draft-${this.#draftSequence++}`;
    const snapshot: WorkflowSnapshot = {
      projectId,
      reportType,
      stage: "sourceDiscovery",
      version: 1,
      updatedAt: new Date().toISOString(),
      events: [],
    };
    this.#workflows.set(projectId, snapshot);
    return clone(snapshot);
  }

  async advance(
    projectId: string,
    expectedStage: WorkflowStage,
    source: WorkflowTransitionSource,
  ) {
    const current = this.#require(projectId);
    if (current.stage !== expectedStage) {
      throw new Error(
        `Workflow ${projectId} is at ${current.stage}, not ${expectedStage}.`,
      );
    }
    return this.setStage(projectId, nextWorkflowStage(current.stage), source);
  }

  async setStage(
    projectId: string,
    stage: WorkflowStage,
    source: WorkflowTransitionSource,
  ) {
    const current = this.#require(projectId);
    if (current.stage === stage) return clone(current);

    const occurredAt = new Date().toISOString();
    const next: WorkflowSnapshot = {
      ...current,
      stage,
      version: current.version + 1,
      updatedAt: occurredAt,
      events: [
        ...current.events,
        {
          id: `${projectId}-${current.version + 1}`,
          from: current.stage,
          to: stage,
          source,
          occurredAt,
        },
      ],
    };
    this.#workflows.set(projectId, next);
    return clone(next);
  }

  #require(projectId: string) {
    const snapshot = this.#workflows.get(projectId);
    if (!snapshot) throw new Error(`Workflow ${projectId} was not found.`);
    return snapshot;
  }
}
