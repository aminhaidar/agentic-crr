import type { PropsWithChildren } from "react";
import type { OperatorAgent } from "@/application/ports/OperatorAgent";
import { OperatorAgentContext } from "./OperatorAgentContext";

export function OperatorAgentProvider({
  children,
  agent,
}: PropsWithChildren<{ agent: OperatorAgent }>) {
  return (
    <OperatorAgentContext.Provider value={agent}>
      {children}
    </OperatorAgentContext.Provider>
  );
}
