/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ml-agent-service origin. When unset, the composer uses the offline mock. */
  readonly VITE_OPERATOR_AGENT_URL?: string;
  /** Stored agent configuration name (defaults to reporting-operator-agent). */
  readonly VITE_OPERATOR_AGENT_NAME?: string;
  /** Optional consumer scope label forwarded for observability. */
  readonly VITE_OPERATOR_AGENT_SCOPE?: string;
  /** Workiva identity headers required by the stored-agent route. */
  readonly VITE_WORKIVA_ACCOUNT_RID?: string;
  readonly VITE_WORKIVA_ORGANIZATION?: string;
  readonly VITE_WORKIVA_USER_RID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
