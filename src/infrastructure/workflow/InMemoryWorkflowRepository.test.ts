import { describe, expect, it } from "vitest";
import { InMemoryWorkflowRepository } from "./InMemoryWorkflowRepository";

describe("InMemoryWorkflowRepository", () => {
  it("starts and advances a canonical workflow", async () => {
    const repository = new InMemoryWorkflowRepository();
    const started = await repository.start("be11");

    expect(started.stage).toBe("sourceDiscovery");

    const advanced = await repository.advance(
      started.projectId,
      "sourceDiscovery",
      "operator",
    );

    expect(advanced.stage).toBe("entityScan");
    expect(advanced.version).toBe(2);
    expect(advanced.events[0]).toMatchObject({
      from: "sourceDiscovery",
      to: "entityScan",
      source: "operator",
    });
  });

  it("rejects stale transitions", async () => {
    const repository = new InMemoryWorkflowRepository();
    const started = await repository.start("be11");

    await expect(
      repository.advance(started.projectId, "planning", "operator"),
    ).rejects.toThrow(/sourceDiscovery, not planning/);
  });

  it("seeds the existing BE-11 project at final approval", async () => {
    const repository = new InMemoryWorkflowRepository();

    await expect(repository.get("be11-fy25")).resolves.toMatchObject({
      stage: "approval",
      reportType: "be11",
    });
  });
});
