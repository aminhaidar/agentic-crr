import { describe, expect, it, vi } from "vitest";
import { HttpOperatorAgent } from "./httpOperatorAgent";

function jsonResponse(body: unknown, init: ResponseInit = { status: 200 }) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    ...init,
  });
}

const config = {
  baseUrl: "http://agent.test",
  agentName: "reporting-operator-agent",
  scope: "agentic-crr",
  identity: {
    accountRid: "acct-1",
    organization: "org-1",
    userRid: "user-1",
  },
};

describe("HttpOperatorAgent", () => {
  it("posts to the stored-agent route with identity headers and no model", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ response: "ok", tool_calls: [], structured_response: {} }),
    );
    const agent = new HttpOperatorAgent({ ...config, fetchImpl });

    await agent.send({ text: "hi", sessionId: "be11-fy25" });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, requestInit] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("http://agent.test/api/v0/agent/reporting-operator-agent");
    const headers = requestInit.headers as Record<string, string>;
    expect(headers["X-Workiva-Accountrid"]).toBe("acct-1");
    expect(headers["X-Workiva-Organization"]).toBe("org-1");
    expect(headers["X-Workiva-Userrid"]).toBe("user-1");
    const body = JSON.parse(requestInit.body as string);
    expect(body).toMatchObject({
      prompt: [{ text: "hi" }],
      stream: false,
      session_id: "be11-fy25",
      scope: "agentic-crr",
    });
    expect(body).not.toHaveProperty("model");
  });

  it("maps a read-only tool call to the artifact it explains", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        response: "Here is the governed scope.",
        tool_calls: [{ tool_name: "get_obligation_recommendations" }],
        structured_response: {},
      }),
    );
    const agent = new HttpOperatorAgent({ ...config, fetchImpl });

    const reply = await agent.send({ text: "what's in scope?" });

    expect(reply.text).toBe("Here is the governed scope.");
    expect(reply.toolCalls).toEqual(["get_obligation_recommendations"]);
    expect(reply.focus).toBe("scope");
  });

  it("throws on a non-2xx response", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        { detail: "boom" },
        { status: 500, statusText: "Server Error" },
      ),
    );
    const agent = new HttpOperatorAgent({ ...config, fetchImpl });

    await expect(agent.send({ text: "hi" })).rejects.toThrow(/500/);
  });
});
