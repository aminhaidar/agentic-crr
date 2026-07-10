import type { OperatorAgent } from "@/application/ports/OperatorAgent";
import { HttpOperatorAgent } from "./httpOperatorAgent";
import { MockOperatorAgent } from "./mockOperatorAgent";

/**
 * Selects the Operator conversation backend from the environment. With
 * VITE_OPERATOR_AGENT_URL set, the composer talks to a real ml-agent-service
 * stored agent; otherwise it uses the offline {@link MockOperatorAgent} so the
 * prototype runs with no backend. This single seam is the whole "go live" step.
 */
function createOperatorAgent(): OperatorAgent {
  const baseUrl = import.meta.env.VITE_OPERATOR_AGENT_URL;
  if (!baseUrl) return new MockOperatorAgent();

  return new HttpOperatorAgent({
    baseUrl,
    agentName:
      import.meta.env.VITE_OPERATOR_AGENT_NAME ?? "reporting-operator-agent",
    scope: import.meta.env.VITE_OPERATOR_AGENT_SCOPE,
    identity: {
      accountRid: import.meta.env.VITE_WORKIVA_ACCOUNT_RID ?? "",
      organization: import.meta.env.VITE_WORKIVA_ORGANIZATION ?? "",
      userRid: import.meta.env.VITE_WORKIVA_USER_RID ?? "",
    },
  });
}

export const operatorAgent = createOperatorAgent();
