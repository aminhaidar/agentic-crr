import type { OperatorAgent } from "@/application/ports/OperatorAgent";
import type {
  OperatorFocus,
  OperatorPrompt,
  OperatorReply,
} from "@/domain/conversation";

/** Workiva identity headers. Auth validation is bypassed in local dev, but the
 * stored-agent route still requires all three (it 400s without a user id). */
export interface WorkivaIdentity {
  accountRid: string;
  organization: string;
  userRid: string;
}

export interface HttpOperatorAgentConfig {
  /** ml-agent-service origin, e.g. http://localhost:5050. */
  baseUrl: string;
  /** Deployed, activated agent configuration name. */
  agentName: string;
  identity: WorkivaIdentity;
  /** Optional consumer scope label forwarded for observability. */
  scope?: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
}

/** Subset of AgentJsonResponse the composer consumes (non-streaming run). */
interface AgentJsonResponse {
  response: string;
  tool_calls?: Array<{ tool_name?: string | null }>;
  structured_response?: Record<string, unknown>;
}

/**
 * Read-only tools the Reporting Operator can call, mapped to the artifact each
 * one explains. Used to route the companion preview from what the agent
 * actually did rather than guessing from the person's wording. Extend this as
 * more read-only FR tools are wired into the agent's allowlist.
 */
const TOOL_FOCUS: Record<string, OperatorFocus> = {
  get_obligation_recommendations: "scope",
};

/**
 * Calls the ml-agent-service stored-agent route
 * (`POST /api/v0/agent/{agentName}`) with streaming disabled so a single
 * {@link AgentJsonResponse} comes back. The model, system prompt, and tools all
 * come from the stored configuration, so this request carries only the prompt
 * and session/identity context.
 */
export class HttpOperatorAgent implements OperatorAgent {
  readonly #config: HttpOperatorAgentConfig;
  readonly #fetch: typeof fetch;

  constructor(config: HttpOperatorAgentConfig) {
    this.#config = config;
    this.#fetch = config.fetchImpl ?? fetch.bind(globalThis);
  }

  async send({ text, sessionId }: OperatorPrompt): Promise<OperatorReply> {
    const { baseUrl, agentName, identity, scope } = this.#config;

    const response = await this.#fetch(
      `${baseUrl}/api/v0/agent/${encodeURIComponent(agentName)}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-Workiva-Accountrid": identity.accountRid,
          "X-Workiva-Organization": identity.organization,
          "X-Workiva-Userrid": identity.userRid,
        },
        body: JSON.stringify({
          prompt: [{ text }],
          stream: false,
          ...(sessionId ? { session_id: sessionId } : {}),
          ...(scope ? { scope } : {}),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Operator agent request failed (${response.status} ${response.statusText}).`,
      );
    }

    const payload = (await response.json()) as AgentJsonResponse;
    const toolCalls = (payload.tool_calls ?? [])
      .map((call) => call.tool_name)
      .filter((name): name is string => Boolean(name));

    return {
      text: payload.response,
      toolCalls,
      focus: toolCalls.map((name) => TOOL_FOCUS[name]).find(Boolean) ?? null,
    };
  }
}
