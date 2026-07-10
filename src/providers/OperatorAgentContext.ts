import { createContext, useContext } from "react";
import type { OperatorAgent } from "@/application/ports/OperatorAgent";

export const OperatorAgentContext = createContext<OperatorAgent | null>(null);

export function useOperatorAgent(): OperatorAgent {
  const agent = useContext(OperatorAgentContext);
  if (!agent) {
    throw new Error(
      "useOperatorAgent must be used inside OperatorAgentProvider",
    );
  }
  return agent;
}
