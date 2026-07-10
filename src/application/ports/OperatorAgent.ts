import type { OperatorPrompt, OperatorReply } from "@/domain/conversation";

/**
 * The Operator's conversational surface.
 *
 * Implementations MUST stay read-only: the agent explains governed state and
 * routes the person to it, but never performs or records official filing
 * actions. Those remain product-service concerns behind the workflow gates.
 */
export interface OperatorAgent {
  send(prompt: OperatorPrompt): Promise<OperatorReply>;
}
