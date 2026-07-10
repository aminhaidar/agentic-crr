import type { OperatorAgent } from "@/application/ports/OperatorAgent";
import type { OperatorPrompt, OperatorReply } from "@/domain/conversation";

const REPLY_DELAY_MS = import.meta.env.MODE === "test" ? 0 : 520;

/**
 * Offline stand-in used when no ml-agent-service endpoint is configured. It
 * mirrors the Reporting Operator's read-only voice so the experience stays
 * demoable without a backend. Swap it for {@link HttpOperatorAgent} by setting
 * VITE_OPERATOR_AGENT_URL.
 */
export class MockOperatorAgent implements OperatorAgent {
  async send({ text }: OperatorPrompt): Promise<OperatorReply> {
    await delay(REPLY_DELAY_MS);
    const normalized = text.toLowerCase();

    if (normalized.includes("scope") || normalized.includes("entit")) {
      return {
        text: "I opened the governed scope beside our thread. Forty affiliates are ready; two still need a human decision. I have not changed either outcome.",
        evidence: "Entity graph · FY25 rule pack · prior-year filed scope",
        focus: "scope",
        toolCalls: [],
      };
    }

    if (normalized.includes("audit") || normalized.includes("record")) {
      return {
        text: "The project record is open. Every agent action, source, resolution, and approval is timestamped there.",
        evidence: "Read-only project activity stream",
        focus: "records",
        toolCalls: [],
      };
    }

    if (normalized.includes("approve") || normalized.includes("file")) {
      return {
        text: "The package is ready for its governed approval gate. Review the final checks beside the thread; I will not submit until an authorized approver commits it.",
        evidence: "Final verification · package v12 · judgment ledger",
        focus: "readiness",
        toolCalls: [],
      };
    }

    return {
      text: "I’m continuing this filing from its current state. I can work the next step, explain a decision, or open the exact record beside us.",
      evidence: "Current project state and governed activity record",
      focus: null,
      toolCalls: [],
    };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
