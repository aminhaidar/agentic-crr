/**
 * The Operator's conversational contract. Kept free of UI and transport
 * concerns so both the offline mock and the ml-agent-service adapter satisfy
 * the same shape (see {@link OperatorAgent}).
 */

/**
 * A governed filing artifact the Operator can point the person to. These are
 * product concepts (scope, mapping, forms, …), not UI widgets — the feature
 * layer maps them onto whichever preview surface is mounted.
 */
export type OperatorFocus =
  "scope" | "mapping" | "forms" | "readiness" | "package" | "records";

export interface OperatorPrompt {
  /** The person's message to the Operator. */
  text: string;
  /**
   * Correlates turns into one durable project thread. Passing it lets
   * ml-agent-service persist conversation memory across turns.
   */
  sessionId?: string | null;
}

export interface OperatorReply {
  /** The Operator's spoken response. */
  text: string;
  /** Short, human-readable basis for the answer (sources · rule pack). */
  evidence?: string;
  /**
   * Read-only artifact the Operator recommends opening beside the thread, or
   * null when the answer needs no companion view.
   */
  focus?: OperatorFocus | null;
  /** Names of the read-only tools the Operator invoked to answer. */
  toolCalls: string[];
}
