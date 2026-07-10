import { useMutation } from "@tanstack/react-query";
import type { OperatorPrompt, OperatorReply } from "@/domain/conversation";
import { useOperatorAgent } from "@/providers/OperatorAgentContext";

export function useSendOperatorMessageMutation() {
  const agent = useOperatorAgent();

  return useMutation<OperatorReply, Error, OperatorPrompt>({
    mutationFn: (prompt) => agent.send(prompt),
  });
}
