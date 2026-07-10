import { describe, expect, it } from "vitest";
import { MockOperatorAgent } from "./mockOperatorAgent";

describe("MockOperatorAgent", () => {
  const agent = new MockOperatorAgent();

  it("routes scope questions to the scope artifact", async () => {
    const reply = await agent.send({ text: "show me the entity scope" });
    expect(reply.focus).toBe("scope");
    expect(reply.text).toMatch(/governed scope/i);
  });

  it("routes approval questions to the readiness artifact", async () => {
    const reply = await agent.send({ text: "can I approve and file this?" });
    expect(reply.focus).toBe("readiness");
  });

  it("routes record questions to the project record", async () => {
    const reply = await agent.send({ text: "open the audit record" });
    expect(reply.focus).toBe("records");
  });

  it("stays read-only with no artifact focus for open-ended prompts", async () => {
    const reply = await agent.send({ text: "hello" });
    expect(reply.focus).toBeNull();
    expect(reply.toolCalls).toEqual([]);
  });
});
