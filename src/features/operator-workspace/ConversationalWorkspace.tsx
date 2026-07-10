import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReportSummary } from "@/application/ports/ReportRepository";
import type { WorkflowStage } from "@/domain/workflow";
import { useReportsQuery } from "@/features/reports/reportQueries";
import {
  useAdvanceWorkflowMutation,
  useStartWorkflowMutation,
  useWorkflowQuery,
} from "@/features/workflow/workflowQueries";
import "./conversational-workspace.css";
import { useFilingSnapshot } from "./useFilingSnapshot";
import { useSendOperatorMessageMutation } from "./operatorQueries";
import { useResizablePreview } from "./useResizablePreview";
import {
  useWorkflowActivity,
  type WorkflowActivityState,
} from "./useWorkflowActivity";

type ArtifactView =
  | "workflow"
  | "scope"
  | "mapping"
  | "forms"
  | "readiness"
  | "package"
  | "records";
type FlowStage = "resume" | WorkflowStage;
type GuidedStage = WorkflowStage;

interface ThreadMessage {
  id: number;
  kind: "user" | "operator" | "system";
  text: string;
  evidence?: string;
}

const scopeRows = [
  ["Germany Manufacturing GmbH", "BE-11B", "Ready", "High"],
  ["Meridian Trading Pte", "BE-11B", "Ready", "High"],
  ["Brazil Services Ltda", "BE-11B", "Needs evidence", "Medium"],
  ["Nordic Assembly AB", "BE-11B", "Ready", "High"],
  ["Dutch Peak Innovations", "Not filing", "Needs review", "Low"],
];

const agentSteps = [
  ["Obligation Scout", "Detected the FY25 obligation and applicable rule pack"],
  ["Scope & Entity", "Grouped 42 affiliates by reporting outcome"],
  ["Mapping & Resolve", "Mapped 18 fields; resolved 3 prior-period variances"],
  ["Validation & Readiness", "Completed final deterministic cross-check"],
];

const auditRows = [
  ["Today · 2:14 PM", "Validation & Readiness", "Final cross-check passed"],
  ["Today · 1:52 PM", "Julie Ruiz", "Accepted Brazil evidence"],
  ["Today · 11:08 AM", "Mapping & Resolve", "Resolved 3 variance warnings"],
  ["Yesterday · 4:31 PM", "Sarah Chen", "Confirmed final entity scope"],
  ["Jun 19 · 9:12 AM", "Operator", "Created governed FY25 workspace"],
];

function Icon({
  name,
  size = 18,
}: {
  name:
    | "panel"
    | "history"
    | "plus"
    | "spark"
    | "chevron"
    | "canvas"
    | "records"
    | "send"
    | "check"
    | "clock"
    | "external"
    | "close";
  size?: number;
}) {
  const paths: Record<typeof name, ReactNode> = {
    panel: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M9 4v16" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5M12 7v5l3 2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    spark: (
      <path d="m12 3 2.3 5.1L20 10.5l-5.7 2.4L12 18l-2.3-5.1L4 10.5l5.7-2.4z" />
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    canvas: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M15 4v16M7 9h4M7 13h4" />
      </>
    ),
    records: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4M9 12h6M9 16h6" />
      </>
    ),
    send: <path d="m7 11 5-5 5 5M12 6v13" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    external: <path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function statusLabel(report: ReportSummary) {
  if (report.status === "needs_you") return "Needs you";
  if (report.status === "waiting") return "Waiting";
  if (report.status === "done") return "Filed";
  return "In progress";
}

function reportMeta(report: ReportSummary) {
  if (report.status === "done") return "Filed with complete audit record";
  if (report.status === "waiting") return "Waiting on a project collaborator";
  if (report.status === "needs_you") return "Approval requested";
  return `${report.percentComplete ?? 0}% ready`;
}

function flowStageLabel(stage: FlowStage) {
  const labels: Record<FlowStage, string> = {
    resume: "In progress",
    sourceDiscovery: "Setup",
    entityScan: "Setup",
    setupProposal: "Setup",
    planning: "Planning",
    mapping: "Data collection",
    collection: "Data collection",
    validation: "Data collection",
    forms: "Review",
    approval: "Review",
    filing: "File",
    complete: "Complete",
  };
  return labels[stage];
}

interface GuidedStageDefinition {
  title: string;
  description: string;
  activity: string;
  action?: string;
  preview: ArtifactView;
  previewAction: string;
  completion: string;
}

const guidedStageOrder: GuidedStage[] = [
  "sourceDiscovery",
  "entityScan",
  "setupProposal",
  "planning",
  "mapping",
  "collection",
  "validation",
  "forms",
  "approval",
  "filing",
  "complete",
];

type PreviewBehavior = "inline" | "suggest" | "auto";

const previewBehavior: Record<GuidedStage, PreviewBehavior> = {
  sourceDiscovery: "inline",
  entityScan: "auto",
  setupProposal: "inline",
  planning: "auto",
  mapping: "auto",
  collection: "auto",
  validation: "suggest",
  forms: "auto",
  approval: "auto",
  filing: "auto",
  complete: "suggest",
};

const flowStageCopy: Record<GuidedStage, GuidedStageDefinition> = {
  sourceDiscovery: {
    title: "Review discovered source data",
    description:
      "I connected the FY25 entity list and trial balance. I could not locate last year’s BE-11, so you can upload it for comparison or continue with the governed sources already available.",
    activity: "Source Discovery scanned connected systems",
    action: "Confirm sources & continue",
    preview: "workflow",
    previewAction: "Review source discovery",
    completion:
      "Source data confirmed. The Entity & Ownership agent started scanning the filing population.",
  },
  entityScan: {
    title: "Confirm the reporting entities",
    description:
      "I found 42 candidate affiliates and reconstructed their ownership paths. Two entities need a person to confirm a recent ownership change.",
    activity: "Entity & Ownership Scan prepared 42 candidates",
    action: "Confirm entities",
    preview: "workflow",
    previewAction: "Review all entities",
    completion:
      "Entities confirmed. The Filing Setup Assistant prepared the report period, due dates, and approval route.",
  },
  setupProposal: {
    title: "Confirm the project setup",
    description:
      "The report period, filing deadline, readiness target, controller, and reminder policy are ready. Confirm them before scope planning begins.",
    activity: "Filing Setup Assistant prepared the project",
    action: "Confirm setup & plan",
    preview: "workflow",
    previewAction: "Review setup proposal",
    completion:
      "Setup confirmed. The Scope & Entity agent started assigning forms and not-filing outcomes.",
  },
  planning: {
    title: "Review the proposed scope",
    description:
      "I assigned the expected BE-11 form to each affiliate and independently checked every not-filing outcome. Two decisions are highlighted for a person.",
    activity: "Scope & Entity prepared 42 outcomes",
    action: "Approve scope & collect",
    preview: "scope",
    previewAction: "Compare all 42 entities",
    completion:
      "Scope approved. Mapping & Resolve started connecting governed fields to the approved forms.",
  },
  mapping: {
    title: "Review field mapping and coverage",
    description:
      "I mapped 18 required fields across the connected systems. Three variances were resolved from governed evidence; four gaps need collection.",
    activity: "Mapping & Resolve prepared field coverage",
    action: "Accept mapping & collect gaps",
    preview: "mapping",
    previewAction: "Compare field mappings",
    completion:
      "Mapping accepted. Collection & Chase prepared four governed requests for the remaining facts.",
  },
  collection: {
    title: "Complete governed data collection",
    description:
      "Connected sources cover 38 affiliates. Four tracked requests are prepared for data owners, with field-level evidence requirements and due dates.",
    activity: "Collection & Chase prepared the remaining requests",
    action: "Complete collection & validate",
    preview: "mapping",
    previewAction: "Review requests and gaps",
    completion:
      "Collection completed. Validation & Readiness started deterministic edit checks and reconciliation.",
  },
  validation: {
    title: "Review validation and package readiness",
    description:
      "All blocking checks passed. Three warnings were resolved, one scope change was documented, and package v12 is ready for form review.",
    activity: "Validation & Readiness completed the cross-check",
    action: "Accept validation & review forms",
    preview: "readiness",
    previewAction: "Review validation details",
    completion:
      "Validation accepted. The Operator prepared every BE-11 form for the required human read-through.",
  },
  forms: {
    title: "Complete the form review",
    description:
      "Forty filing forms are populated. Two high-judgment forms are highlighted for review before the final approval ledger can open.",
    activity: "Form Review prepared the filing set",
    action: "Mark forms reviewed",
    preview: "forms",
    previewAction: "Review forms",
    completion:
      "Form review completed. The final judgment ledger is ready for the authorized approver.",
  },
  approval: {
    title: "Approve the final package",
    description:
      "All blocking checks passed, three warnings were resolved, and package v12 is staged. This gate records the authorized human decision.",
    activity: "Validation & Readiness prepared the judgment ledger",
    action: "Approve final package",
    preview: "readiness",
    previewAction: "Review judgment ledger",
    completion:
      "Final package approved. The signed decision and package version were committed to the project record.",
  },
  filing: {
    title: "Authorize and transmit the filing",
    description:
      "The approved BEA package, evidence manifest, and filing credentials are staged. Transmission remains a separate authorized action.",
    activity: "Filing Assistant staged package v12",
    action: "File with BEA",
    preview: "package",
    previewAction: "Review filing package",
    completion:
      "BEA transmission accepted. The Operator started closeout, evidence preservation, and next-period monitoring.",
  },
  complete: {
    title: "Filing complete",
    description:
      "The receipt, signed decisions, package hash, evidence manifest, blueprint, and rule-pack versions are preserved in the durable project record.",
    activity: "The Operator completed the governed workflow",
    preview: "records",
    previewAction: "Open project record",
    completion: "The governed BE-11 workflow is complete.",
  },
};

export function ConversationalWorkspace() {
  const reportsQuery = useReportsQuery();
  const reports = useMemo(() => reportsQuery.data ?? [], [reportsQuery.data]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactView, setArtifactView] = useState<ArtifactView>("readiness");
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [bootstrapStage, setBootstrapStage] = useState<FlowStage>("resume");
  const [composerValue, setComposerValue] = useState("");
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [approvedReports, setApprovedReports] = useState<Set<string>>(
    () => new Set(),
  );
  const previewResize = useResizablePreview();
  const filingSnapshot = useFilingSnapshot();
  const workflowQuery = useWorkflowQuery(workflowId);
  const { mutateAsync: startWorkflow } = useStartWorkflowMutation();
  const { mutateAsync: advanceWorkflow, isPending: workflowTransitioning } =
    useAdvanceWorkflowMutation();
  const { mutateAsync: sendOperatorMessage } = useSendOperatorMessageMutation();
  const nextMessageId = useRef(1);
  const threadEnd = useRef<HTMLDivElement>(null);

  const selectedReport =
    reports.find(({ id }) => id === selectedReportId) ?? reports[0];
  // The real filing (RPT) is the source of truth for the stage; the fake
  // workflow query / bootstrap are only fallbacks until a filing is entered.
  const flowStage: FlowStage =
    filingSnapshot?.stage ?? workflowQuery.data?.stage ?? bootstrapStage;
  const workflowActivity = useWorkflowActivity(
    flowStage === "resume" ? null : flowStage,
    bootstrapStage !== "resume",
  );
  const isApproved =
    flowStage === "filing" ||
    flowStage === "complete" ||
    (selectedReport
      ? selectedReport.status === "done" ||
        approvedReports.has(selectedReport.id)
      : false);
  const isGuidedFlow = flowStage !== "resume";
  const artifactReady = !isGuidedFlow || Boolean(workflowActivity?.ready);
  const activeTitle = isGuidedFlow
    ? "BE-11 · New filing"
    : selectedReport?.title;
  const nextAction =
    flowStage !== "resume"
      ? flowStageCopy[flowStage]
      : isApproved
        ? {
            title: "Review the committed project record",
            action: "Open project record",
          }
        : {
            title: "Approve the final filing package",
            action: "Review approval gate",
          };
  const previewLabels: Record<ArtifactView, string> = {
    workflow: "Current step",
    scope: "Scope",
    mapping: "Data",
    forms: "Forms",
    readiness: "Readiness",
    package: "Package",
    records: "Record",
  };
  const stagePreview =
    flowStage === "resume" ? "readiness" : flowStageCopy[flowStage].preview;
  const previewTabs: ArtifactView[] = Array.from(
    new Set(
      isGuidedFlow
        ? [stagePreview, "records"]
        : ["scope", "readiness", "records"],
    ),
  );

  useLayoutEffect(() => {
    document.body.classList.toggle("conversation-session", sessionActive);
    return () => {
      document.body.classList.remove("conversation-session");
    };
  }, [sessionActive]);

  useEffect(() => {
    if (!historyOpen && !artifactOpen) return;
    const closePanels = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setHistoryOpen(false);
      setArtifactOpen(false);
    };
    window.addEventListener("keydown", closePanels);
    return () => window.removeEventListener("keydown", closePanels);
  }, [artifactOpen, historyOpen]);

  useEffect(() => {
    window.__startConversationalProject = ({ type, resume, sessionId }) => {
      if (type !== "be11") return;
      if (sessionId) setSelectedReportId(sessionId);
      setSessionActive(true);
      setBootstrapStage(resume ? "resume" : "sourceDiscovery");
      if (resume) {
        const filingId = sessionId ?? "be11-fy25";
        setWorkflowId(filingId);
        // Enter the real filing under the Operator surface so the conversation
        // reflects (and drives) the same RPT the tabbed view would show.
        window.__opEnterFiling?.(filingId);
      } else {
        setWorkflowId(null);
        void startWorkflow(type).then((workflow) => {
          setWorkflowId(workflow.projectId);
        });
      }
      setArtifactView(resume ? "readiness" : "workflow");
      setArtifactOpen(false);
      setHistoryOpen(false);
      setMessages([]);
      setComposerValue("");
      window.go("home");
    };
    window.__exitConversationalProject = () => {
      setSessionActive(false);
      setHistoryOpen(false);
      setArtifactOpen(false);
      setBootstrapStage("resume");
      setWorkflowId(null);
    };
    return () => {
      delete window.__startConversationalProject;
      delete window.__exitConversationalProject;
    };
  }, [startWorkflow]);

  useEffect(() => {
    threadEnd.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, thinking]);

  const recentReports = useMemo(
    () => reports.filter(({ status }) => status !== "done").slice(0, 5),
    [reports],
  );
  const filedReports = useMemo(
    () => reports.filter(({ status }) => status === "done").slice(0, 4),
    [reports],
  );

  function selectReport(id: string) {
    setSelectedReportId(id);
    setBootstrapStage("resume");
    setWorkflowId(id);
    setMessages([]);
    setArtifactView("readiness");
    setArtifactOpen(false);
    setHistoryOpen(false);
    window.__opEnterFiling?.(id);
  }

  function openArtifact(view: ArtifactView) {
    setArtifactView(view);
    setArtifactOpen(true);
  }

  function openManualWorkspace() {
    const manualTab: Record<GuidedStage, string> = {
      sourceDiscovery: "setup",
      entityScan: "setup",
      setupProposal: "setup",
      planning: "scoping",
      mapping: "mapping",
      collection: "mapping",
      validation: "mapping",
      forms: "review",
      approval: "review",
      filing: "file",
      complete: "activity",
    };
    // When a real filing is active, reveal the tabbed view of that exact RPT —
    // no rebuild, no fast-forwarded flags, so the two surfaces always agree.
    if (filingSnapshot) {
      window.__opRevealManual?.(
        flowStage !== "resume" ? manualTab[flowStage] : "overview",
      );
      return;
    }
    window.__exitConversationalProject?.();
    if (flowStage !== "resume") {
      window.openManualReport?.(
        "be11",
        manualTab[flowStage],
        workflowId,
        flowStage,
      );
    } else if (selectedReport) window.openManualProject?.(selectedReport.id);
    else window.go("filings");
  }

  function startBe11Session() {
    window.__startConversationalProject?.({
      type: "be11",
      resume: false,
      sessionId: null,
    });
  }

  function leaveSession(view: "home" | "filings") {
    window.__exitConversationalProject?.();
    window.go(view);
  }

  function appendMessage(message: Omit<ThreadMessage, "id">) {
    setMessages((current) => [
      ...current,
      { ...message, id: nextMessageId.current++ },
    ]);
  }

  async function submitMessage(event: FormEvent) {
    event.preventDefault();
    const text = composerValue.trim();
    if (!text || thinking) return;

    setComposerValue("");
    appendMessage({ kind: "user", text });
    setThinking(true);

    try {
      const reply = await sendOperatorMessage({
        text,
        sessionId: workflowId ?? selectedReport?.id ?? null,
      });
      if (reply.focus) openArtifact(reply.focus);
      appendMessage({
        kind: "operator",
        text: reply.text,
        evidence: reply.evidence,
      });
    } catch {
      appendMessage({
        kind: "operator",
        text: "I couldn’t reach the Operator service just now. Your message is saved—try again in a moment.",
      });
    } finally {
      setThinking(false);
    }
  }

  function approvePackage() {
    if (!selectedReport || isApproved) return;
    if (flowStage === "approval") {
      advanceFlow();
      return;
    }
    setApprovedReports((current) => {
      const next = new Set(current);
      next.add(selectedReport.id);
      return next;
    });
    appendMessage({
      kind: "system",
      text: `Julie Ruiz approved ${selectedReport.title}. The approval, package version, sources, and timestamp were added to the durable project record.`,
    });
  }

  function advanceFlow() {
    if (
      flowStage === "resume" ||
      flowStage === "complete" ||
      !workflowId ||
      !workflowActivity?.ready ||
      workflowTransitioning
    )
      return;

    void advanceWorkflow({
      projectId: workflowId,
      expectedStage: flowStage,
    }).then((workflow) => {
      appendMessage({
        kind: "system",
        text: flowStageCopy[flowStage].completion,
      });
      setArtifactView(flowStageCopy[workflow.stage].preview);
      setArtifactOpen(
        (currentlyOpen) =>
          currentlyOpen || previewBehavior[workflow.stage] === "auto",
      );
    });
  }

  if (reportsQuery.isPending || !selectedReport) {
    return (
      <div className="cw-loading">
        <span className="cw-spinner" />
        Opening your Operator workspace…
      </div>
    );
  }

  return (
    <div className="cw-shell">
      <header className="cw-header">
        <div className="cw-header-start">
          <button
            className="cw-icon-button"
            type="button"
            aria-label={
              historyOpen
                ? "Hide conversation history"
                : "Show conversation history"
            }
            aria-expanded={historyOpen}
            aria-controls="cw-conversation-history"
            onClick={() => setHistoryOpen((current) => !current)}
          >
            <Icon name="panel" />
          </button>
          <span className="cw-header-divider" />
          <button
            className="cw-home-link"
            type="button"
            onClick={() => leaveSession("home")}
          >
            Operator home
          </button>
          <span className="cw-breadcrumb-separator">/</span>
          <div className="cw-project-title">
            <strong>{activeTitle}</strong>
            <span>
              {isGuidedFlow
                ? "Conversation-led filing workflow"
                : selectedReport.subtitle}
            </span>
          </div>
        </div>
        <div className="cw-header-actions">
          <span className={`cw-status cw-status-${selectedReport.status}`}>
            <span aria-hidden="true" />
            {isGuidedFlow
              ? flowStageLabel(flowStage)
              : statusLabel(selectedReport)}
          </span>
          <button
            className="cw-button cw-button-quiet"
            type="button"
            aria-expanded={artifactOpen}
            aria-controls="cw-preview"
            aria-label={artifactOpen ? "Hide preview" : "Show preview"}
            onClick={() => setArtifactOpen((current) => !current)}
          >
            <Icon name="canvas" size={16} />
            {artifactOpen ? "Hide preview" : "Show preview"}
          </button>
          <button
            className="cw-button"
            type="button"
            aria-label="Open manual workspace"
            onClick={openManualWorkspace}
          >
            Manual workspace
            <Icon name="external" size={15} />
          </button>
        </div>
      </header>

      <div
        className="cw-body"
        style={
          {
            "--cw-preview-width": `${previewResize.width}px`,
          } as CSSProperties
        }
      >
        {(historyOpen || artifactOpen) && (
          <button
            className="cw-overlay-scrim"
            type="button"
            aria-label="Close open panel"
            onClick={() => {
              setHistoryOpen(false);
              setArtifactOpen(false);
            }}
          />
        )}
        <aside
          id="cw-conversation-history"
          aria-label="Conversation history"
          aria-hidden={!historyOpen}
          className={`cw-history ${historyOpen ? "is-open" : ""}`}
        >
          <div className="cw-history-head">
            <div>
              <span className="cw-eyebrow">Conversation history</span>
              <h2>Resume work</h2>
            </div>
            <button
              type="button"
              className="cw-icon-button cw-mobile-close"
              aria-label="Close project history"
              onClick={() => setHistoryOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <button
            className="cw-new-project"
            type="button"
            onClick={startBe11Session}
          >
            <Icon name="plus" size={16} />
            Start BE-11
          </button>

          <div className="cw-history-section">
            <span className="cw-history-label">In progress</span>
            {recentReports.map((report) => (
              <button
                key={report.id}
                type="button"
                className={`cw-project-row ${
                  report.id === selectedReport.id ? "is-active" : ""
                }`}
                onClick={() => selectReport(report.id)}
              >
                <span className="cw-project-mark">{report.code}</span>
                <span className="cw-project-copy">
                  <strong>{report.title}</strong>
                  <span>{reportMeta(report)}</span>
                </span>
                <Icon name="chevron" size={14} />
              </button>
            ))}
          </div>

          <div className="cw-history-section">
            <span className="cw-history-label">Filed</span>
            {filedReports.map((report) => (
              <button
                key={report.id}
                type="button"
                className={`cw-project-row ${
                  report.id === selectedReport.id ? "is-active" : ""
                }`}
                onClick={() => selectReport(report.id)}
              >
                <span className="cw-project-mark is-filed">
                  <Icon name="check" size={14} />
                </span>
                <span className="cw-project-copy">
                  <strong>{report.title}</strong>
                  <span>{reportMeta(report)}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="cw-all-records"
            onClick={() => leaveSession("filings")}
          >
            <Icon name="records" size={16} />
            Browse all records
          </button>
          <button
            type="button"
            className="cw-all-records"
            onClick={() => leaveSession("home")}
          >
            <Icon name="chevron" size={16} />
            Back to Operator home
          </button>
        </aside>

        <main className="cw-thread">
          <div className="cw-thread-scroll">
            <div className="cw-thread-inner">
              <div className={`cw-resume ${isGuidedFlow ? "cw-hidden" : ""}`}>
                <span className="cw-resume-icon">
                  <Icon name="clock" size={16} />
                </span>
                <div>
                  <strong>Welcome back, Julie</strong>
                  <p>
                    While you were away, the Operator resolved three mapping
                    warnings and prepared the final package. One governed
                    approval needs you.
                  </p>
                </div>
                <button type="button" onClick={() => openArtifact("records")}>
                  See activity
                </button>
              </div>

              <div
                className={`cw-day-divider ${isGuidedFlow ? "cw-hidden" : ""}`}
              >
                <span>Today</span>
              </div>

              <article
                className={`cw-turn cw-turn-user ${
                  isGuidedFlow ? "cw-hidden" : ""
                }`}
              >
                <div className="cw-user-avatar">JR</div>
                <div>
                  <div className="cw-turn-meta">
                    <strong>You</strong>
                    <span>9:04 AM</span>
                  </div>
                  <p>
                    Continue the FY25 filing. Resolve what you can and bring me
                    the decisions that need a person.
                  </p>
                </div>
              </article>

              <article
                className={`cw-turn cw-turn-operator ${
                  isGuidedFlow ? "cw-hidden" : ""
                }`}
              >
                <div className="cw-operator-avatar">
                  <Icon name="spark" size={16} />
                </div>
                <div className="cw-turn-content">
                  <div className="cw-turn-meta">
                    <strong>Operator</strong>
                    <span>9:04 AM</span>
                  </div>
                  <p>
                    I resumed the canonical project record and ran the remaining
                    work within your approved autonomy limits. I did not cross
                    the final signature gate.
                  </p>

                  <section className="cw-tool-card">
                    <div className="cw-tool-head">
                      <span className="cw-tool-icon">
                        <Icon name="spark" size={15} />
                      </span>
                      <div>
                        <strong>Ran filing workflow</strong>
                        <span>4 agents · 2m 18s</span>
                      </div>
                      <span className="cw-complete-label">
                        <Icon name="check" size={13} />
                        Complete
                      </span>
                    </div>
                    <div className="cw-agent-list">
                      {agentSteps.map(([name, result]) => (
                        <div className="cw-agent-row" key={name}>
                          <span className="cw-agent-check">
                            <Icon name="check" size={12} />
                          </span>
                          <div>
                            <strong>{name}</strong>
                            <span>{result}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cw-tool-actions">
                      <button
                        type="button"
                        onClick={() => openArtifact("scope")}
                      >
                        Review scope
                      </button>
                      <button
                        type="button"
                        onClick={() => openArtifact("records")}
                      >
                        Open evidence
                      </button>
                    </div>
                  </section>

                  <p>
                    The filing is <strong>92% ready</strong>. All 42 affiliate
                    outcomes are accounted for, required evidence is attached,
                    and the deterministic final check passed.
                  </p>

                  <section
                    className={`cw-approval ${isApproved ? "is-approved" : ""}`}
                  >
                    <div className="cw-approval-icon">
                      <Icon name={isApproved ? "check" : "records"} size={18} />
                    </div>
                    <div className="cw-approval-copy">
                      <span className="cw-eyebrow">
                        {isApproved ? "Committed" : "Approval required"}
                      </span>
                      <strong>
                        {isApproved
                          ? "Final package approved"
                          : "Approve the final filing package"}
                      </strong>
                      <p>
                        {isApproved
                          ? "The signed decision and package version are preserved in the project record."
                          : "This records your identity, the judgment ledger, package v12, and the final validation result. It does not transmit to BEA yet."}
                      </p>
                    </div>
                    <div className="cw-approval-actions">
                      <button
                        type="button"
                        className="cw-button cw-button-quiet"
                        onClick={() => openArtifact("readiness")}
                      >
                        Review
                      </button>
                      {!isApproved && (
                        <button
                          type="button"
                          className="cw-button cw-button-primary"
                          onClick={approvePackage}
                        >
                          Approve package
                        </button>
                      )}
                    </div>
                  </section>

                  <div className="cw-evidence">
                    <Icon name="check" size={13} />
                    Based on 6 governed sources · rule pack BE-11.2026.2 ·
                    blueprint v4
                  </div>
                </div>
              </article>

              {isGuidedFlow && (
                <GuidedFlowThread
                  stage={flowStage}
                  activity={workflowActivity}
                  onAdvance={advanceFlow}
                  onOpenArtifact={openArtifact}
                />
              )}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`cw-turn cw-turn-${message.kind}`}
                >
                  {message.kind === "user" ? (
                    <div className="cw-user-avatar">JR</div>
                  ) : message.kind === "operator" ? (
                    <div className="cw-operator-avatar">
                      <Icon name="spark" size={16} />
                    </div>
                  ) : (
                    <div className="cw-system-mark">
                      <Icon name="check" size={13} />
                    </div>
                  )}
                  <div className="cw-turn-content">
                    <div className="cw-turn-meta">
                      <strong>
                        {message.kind === "user"
                          ? "You"
                          : message.kind === "operator"
                            ? "Operator"
                            : "Project record"}
                      </strong>
                      <span>Just now</span>
                    </div>
                    <p>{message.text}</p>
                    {message.evidence && (
                      <div className="cw-evidence">
                        <Icon name="check" size={13} />
                        {message.evidence}
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {thinking && (
                <article className="cw-turn cw-turn-operator">
                  <div className="cw-operator-avatar">
                    <Icon name="spark" size={16} />
                  </div>
                  <div className="cw-thinking" aria-label="Operator is working">
                    <i />
                    <i />
                    <i />
                  </div>
                </article>
              )}
              <div ref={threadEnd} />
            </div>
          </div>

          <div className="cw-composer-wrap">
            <div className="cw-next-action">
              <div>
                <span>Next action</span>
                <strong>{nextAction.title}</strong>
              </div>
              <button
                type="button"
                disabled={isGuidedFlow && !workflowActivity?.ready}
                onClick={() => {
                  if (isGuidedFlow && flowStage !== "complete") advanceFlow();
                  else if (!isGuidedFlow && !isApproved)
                    openArtifact("readiness");
                  else openArtifact("records");
                }}
              >
                {isGuidedFlow && !workflowActivity?.ready
                  ? "Working…"
                  : (nextAction.action ?? "Open project record")}
                <Icon name="chevron" size={15} />
              </button>
            </div>
            <div className="cw-suggestions">
              <button type="button" onClick={() => openArtifact("readiness")}>
                Review final checks
              </button>
              <button type="button" onClick={() => openArtifact("scope")}>
                Explain scope changes
              </button>
              <button type="button" onClick={() => openArtifact("records")}>
                Show project record
              </button>
            </div>
            <form className="cw-composer" onSubmit={submitMessage}>
              <textarea
                aria-label="Message the Operator"
                value={composerValue}
                onChange={(event) =>
                  setComposerValue(event.currentTarget.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder={`Ask the Operator to continue ${isGuidedFlow ? flowStageLabel(flowStage) : selectedReport.code}, explain a decision, or open a record…`}
                rows={2}
              />
              <div className="cw-composer-bar">
                <button
                  className="cw-attach"
                  type="button"
                  onClick={() =>
                    window.showToast("Attach governed source data (demo)")
                  }
                >
                  <Icon name="plus" size={17} />
                  Attach
                </button>
                <div className="cw-composer-context">
                  <span>Prepare autonomy</span>
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!composerValue.trim() || thinking}
                  >
                    <Icon name="send" size={18} />
                  </button>
                </div>
              </div>
            </form>
            <p className="cw-composer-note">
              The Operator can prepare work independently. Approval and filing
              always require an authorized person.
            </p>
          </div>
        </main>

        {artifactOpen && (
          <div
            className="cw-preview-resizer"
            role="separator"
            aria-label="Resize preview"
            aria-orientation="vertical"
            aria-valuemin={340}
            aria-valuemax={760}
            aria-valuenow={previewResize.width}
            tabIndex={0}
            onPointerDown={previewResize.onPointerDown}
            onKeyDown={previewResize.onKeyDown}
          />
        )}
        <aside
          id="cw-preview"
          aria-label="Artifact preview"
          aria-hidden={!artifactOpen}
          className={`cw-canvas ${artifactOpen ? "is-open" : ""}`}
        >
          <div className="cw-canvas-head">
            <div>
              <span className="cw-eyebrow">Preview</span>
              <h2>{activeTitle}</h2>
            </div>
            <button
              type="button"
              className="cw-icon-button cw-mobile-close"
              aria-label="Close preview"
              onClick={() => setArtifactOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="cw-canvas-tabs" role="tablist" aria-label="Preview">
            {previewTabs.map((view) => (
              <button
                type="button"
                role="tab"
                aria-selected={artifactView === view}
                key={view}
                className={artifactView === view ? "is-active" : ""}
                onClick={() => setArtifactView(view)}
              >
                {previewLabels[view]}
              </button>
            ))}
          </div>

          <div className="cw-canvas-body">
            {isGuidedFlow &&
              !artifactReady &&
              artifactView !== "workflow" &&
              workflowActivity && (
                <ActivityProgress activity={workflowActivity} expanded />
              )}
            {artifactView === "workflow" && isGuidedFlow && (
              <WorkflowArtifact
                stage={flowStage}
                activity={workflowActivity}
                onAdvance={advanceFlow}
              />
            )}
            {artifactView === "scope" && artifactReady && (
              <ScopeArtifact onOpenManual={openManualWorkspace} />
            )}
            {artifactView === "mapping" && artifactReady && (
              <MappingArtifact onOpenManual={openManualWorkspace} />
            )}
            {artifactView === "forms" && artifactReady && (
              <FormsArtifact onOpenManual={openManualWorkspace} />
            )}
            {artifactView === "readiness" && artifactReady && (
              <ReadinessArtifact
                approved={isApproved}
                allowApproval={!isGuidedFlow}
                onApprove={approvePackage}
                onOpenManual={openManualWorkspace}
              />
            )}
            {artifactView === "package" && artifactReady && (
              <PackageArtifact onOpenManual={openManualWorkspace} />
            )}
            {artifactView === "records" && artifactReady && (
              <RecordArtifact onOpenManual={openManualWorkspace} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function GuidedFlowThread({
  stage,
  activity,
  onAdvance,
  onOpenArtifact,
}: {
  stage: Exclude<FlowStage, "resume">;
  activity: WorkflowActivityState | null;
  onAdvance: () => void;
  onOpenArtifact: (view: ArtifactView) => void;
}) {
  const copy = flowStageCopy[stage];
  const stageIndex = guidedStageOrder.indexOf(stage);
  const ready = activity?.ready ?? true;

  return (
    <>
      <article className="cw-turn cw-turn-user">
        <div className="cw-user-avatar">JR</div>
        <div>
          <div className="cw-turn-meta">
            <strong>You</strong>
            <span>Just now</span>
          </div>
          <p>
            Start a BE-11 filing and guide it from setup through the governed
            approval.
          </p>
        </div>
      </article>

      <article className="cw-turn cw-turn-operator">
        <div className="cw-operator-avatar">
          <Icon name="spark" size={16} />
        </div>
        <div className="cw-turn-content">
          <div className="cw-turn-meta">
            <strong>Operator</strong>
            <span>Working session</span>
          </div>
          <p>
            {stage === "sourceDiscovery"
              ? "I created a new BE-11 report and started Quick setup. I’m scanning connected systems for the source data we can reuse before we define the filing population."
              : "I’ll continue the work stage by stage, keep dense structured output in the preview, and stop at every decision that requires a person."}
          </p>

          <section className="cw-tool-card cw-guided-card">
            <div className="cw-tool-head">
              <span className="cw-tool-icon">
                <Icon
                  name={stage === "complete" ? "check" : "spark"}
                  size={15}
                />
              </span>
              <div>
                <strong>
                  {ready
                    ? copy.activity
                    : (activity?.activeStep ?? "Starting governed work")}
                </strong>
                <span>
                  Step {stageIndex + 1} of {guidedStageOrder.length} ·{" "}
                  {flowStageLabel(stage)}
                </span>
              </div>
              <span
                className={
                  stage === "complete"
                    ? "cw-complete-label"
                    : ready
                      ? "cw-ready-label"
                      : "cw-running-label"
                }
              >
                {stage === "complete"
                  ? "Complete"
                  : ready
                    ? "Ready"
                    : "Running"}
              </span>
            </div>
            <div className="cw-guided-body">
              <span className="cw-eyebrow">{flowStageLabel(stage)}</span>
              <h3>{ready ? copy.title : "The Operator is working"}</h3>
              <p>
                {ready
                  ? copy.description
                  : "I’m working through the governed sources and rules now. Results and the next approval will appear here as each check completes."}
              </p>
              {!ready && activity && <ActivityProgress activity={activity} />}
              <div className="cw-stage-progress">
                {guidedStageOrder.map((item, index) => (
                  <span
                    key={item}
                    className={
                      index < stageIndex
                        ? "is-complete"
                        : index === stageIndex
                          ? "is-current"
                          : ""
                    }
                  />
                ))}
              </div>
            </div>
            <div className="cw-tool-actions cw-guided-actions">
              <button
                type="button"
                onClick={() => onOpenArtifact(copy.preview)}
              >
                {copy.previewAction}
              </button>
              {copy.action && ready && (
                <button
                  type="button"
                  className="is-primary"
                  onClick={onAdvance}
                >
                  {copy.action}
                </button>
              )}
            </div>
          </section>

          <div className="cw-evidence">
            <Icon name="check" size={13} />
            Canonical project thread · actions and approvals remain attributable
          </div>
        </div>
      </article>
    </>
  );
}

function ActivityProgress({
  activity,
  expanded = false,
}: {
  activity: WorkflowActivityState;
  expanded?: boolean;
}) {
  return (
    <div
      className={`cw-activity-progress ${expanded ? "is-expanded" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="cw-activity-progress-head">
        <span className="cw-activity-spinner" aria-hidden="true" />
        <div>
          <strong>Operator working</strong>
          <span>{activity.activeStep ?? "Preparing results"}</span>
        </div>
        <small>{activity.progress}%</small>
      </div>
      <div className="cw-activity-progress-track" aria-hidden="true">
        <span style={{ width: `${activity.progress}%` }} />
      </div>
      <div className="cw-activity-steps">
        {activity.steps.map((step, index) => {
          const complete = index < activity.visibleStepCount;
          const active = index === activity.visibleStepCount;
          return (
            <div
              className={complete ? "is-complete" : active ? "is-active" : ""}
              key={step}
            >
              <i>
                {complete ? (
                  <Icon name="check" size={10} />
                ) : active ? (
                  <span />
                ) : null}
              </i>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowArtifact({
  stage,
  activity,
  onAdvance,
}: {
  stage: Exclude<FlowStage, "resume">;
  activity: WorkflowActivityState | null;
  onAdvance: () => void;
}) {
  const copy = flowStageCopy[stage];
  const ready = activity?.ready ?? true;

  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Active workflow step</span>
          <h3>{copy.title}</h3>
          <p>
            {ready
              ? copy.description
              : "Live governed activity appears here while the Operator prepares the result."}
          </p>
        </div>
      </div>

      {stage === "sourceDiscovery" && <QuickSetupPreview activity={activity} />}

      {stage !== "sourceDiscovery" && !ready && activity && (
        <ActivityProgress activity={activity} expanded />
      )}

      {stage === "entityScan" && ready && <EntityScanPreview />}

      {stage === "setupProposal" && ready && <SetupProposalPreview />}

      {stage === "planning" && ready && (
        <>
          <div className="cw-scope-summary">
            <div>
              <strong>40</strong>
              <span>Filing</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Needs review</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Blocked</span>
            </div>
          </div>
          <div className="cw-workflow-callout">
            Two minority-owned affiliates need confirmation before the Operator
            can commit their not-filing outcomes.
          </div>
        </>
      )}

      {stage === "collection" && ready && (
        <div className="cw-source-list">
          {[
            ["NetSuite ERP", "Connected · 31 affiliates"],
            ["Consolidation system", "Connected · ownership graph"],
            ["HRIS export", "Accepted · employee counts"],
            ["Tracked requests", "4 prepared · 0 overdue"],
          ].map(([name, detail]) => (
            <div key={name}>
              <span className="cw-agent-check">
                <Icon name="check" size={12} />
              </span>
              <span>
                <strong>{name}</strong>
                <small>{detail}</small>
              </span>
            </div>
          ))}
        </div>
      )}

      {stage === "validation" && ready && (
        <div className="cw-check-list">
          {[
            ["Scope", "42 of 42 outcomes accounted for"],
            ["Required fields", "All blocking fields populated"],
            ["Evidence", "128 source links attached"],
            ["Validation", "0 blocking errors · 3 resolved warnings"],
            ["Package", "BEA package v12 staged"],
          ].map(([name, detail]) => (
            <div key={name}>
              <span className="cw-agent-check">
                <Icon name="check" size={12} />
              </span>
              <span>
                <strong>{name}</strong>
                <small>{detail}</small>
              </span>
            </div>
          ))}
        </div>
      )}

      {stage === "complete" && ready && (
        <div className="cw-workflow-receipt">
          <span className="cw-agent-check">
            <Icon name="check" size={13} />
          </span>
          <div>
            <span className="cw-eyebrow">Governed commit</span>
            <strong>Package approved by Julie Ruiz</strong>
            <p>
              Package v12 · rule pack BE-11.2026.2 · blueprint v4 · recorded
              just now
            </p>
          </div>
        </div>
      )}

      {copy.action && ready && (
        <button
          type="button"
          className="cw-canvas-action cw-canvas-primary"
          onClick={onAdvance}
        >
          {copy.action}
          <Icon name="chevron" size={15} />
        </button>
      )}
    </div>
  );
}

function QuickSetupPreview({
  activity,
}: {
  activity: WorkflowActivityState | null;
}) {
  const milestones = [
    "Source data",
    "Entities scoped",
    "Entities confirmed",
    "Setup proposed",
    "Setup confirmed",
  ];
  const sources = [
    {
      name: "Entity List",
      detail: "Workiva Data Hub · entity register",
      status: "Found",
      tone: "found",
    },
    {
      name: "Trial Balance · Fiscal Year 2025",
      detail: "NetSuite · consolidated ledger",
      status: "Found",
      tone: "found",
    },
    {
      name: "Prior-year filings",
      detail: "Last year’s filed BE-11",
      status: "Not found",
      tone: "missing",
    },
  ];
  const visibleSources = activity?.ready
    ? sources.length
    : Math.min(activity?.visibleStepCount ?? 0, sources.length);

  return (
    <div className="cw-quick-setup">
      <div className="cw-setup-progress">
        <div>
          <strong>Setup progress</strong>
          <span>
            {activity?.ready
              ? "1 of 5 · 20%"
              : `Source scan · ${Math.round((activity?.progress ?? 0) * 0.2)}%`}
          </span>
        </div>
        <div className="cw-setup-progress-track">
          <span
            style={{
              width: `${Math.max(3, (activity?.progress ?? 0) * 0.2)}%`,
            }}
          />
        </div>
        <div className="cw-setup-milestones">
          {milestones.map((milestone, index) => (
            <div
              className={
                index === 0
                  ? activity?.ready
                    ? "is-active"
                    : "is-running"
                  : ""
              }
              key={milestone}
            >
              <i>
                {index === 0 && activity?.ready ? (
                  <Icon name="check" size={10} />
                ) : null}
              </i>
              <span>{milestone}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="cw-discovery-card">
        <div className="cw-discovery-head">
          <span className="cw-tool-icon">
            <Icon name="spark" size={15} />
          </span>
          <div>
            <strong>Source Discovery</strong>
            <span>
              {activity?.ready
                ? "Connected-system scan complete"
                : (activity?.activeStep ??
                  "Scanning connected systems for this BE-11")}
            </span>
          </div>
          <small>
            {activity?.ready
              ? "Complete"
              : `${visibleSources} of ${sources.length}`}
          </small>
        </div>

        <div
          className="cw-source-results"
          aria-live="polite"
          aria-label="Discovered sources"
        >
          {sources.slice(0, visibleSources).map((source) => (
            <div className={`is-${source.tone}`} key={source.name}>
              <span className="cw-source-result-icon">
                <Icon
                  name={source.tone === "found" ? "check" : "close"}
                  size={12}
                />
              </span>
              <span>
                <strong>{source.name}</strong>
                <small>{source.detail}</small>
              </span>
              <em>{source.status}</em>
            </div>
          ))}
          {!activity?.ready && (
            <div className="is-scanning">
              <span className="cw-activity-spinner" aria-hidden="true" />
              <span>
                <strong>Scanning governed sources</strong>
                <small>{activity?.activeStep ?? "Starting source scan"}</small>
              </span>
              <em>Checking</em>
            </div>
          )}
        </div>

        {activity?.ready && (
          <div className="cw-discovery-note">
            The prior filing improves year-over-year comparison, but it is not
            required to continue.
          </div>
        )}
      </section>

      <button
        className="cw-upload-source"
        type="button"
        onClick={() => window.showToast("Upload governed source data (demo)")}
      >
        <Icon name="plus" size={14} />
        Upload source files
      </button>
    </div>
  );
}

function EntityScanPreview() {
  return (
    <div className="cw-workflow-fields">
      <WorkflowField label="Candidate affiliates" value="42 found" />
      <WorkflowField label="Ownership paths confirmed" value="40" />
      <WorkflowField label="Needs review" value="2 entities" />
      <WorkflowField label="Excluded as immaterial" value="0" />
      <WorkflowField label="Source" value="Entity register · FY25" />
    </div>
  );
}

function SetupProposalPreview() {
  return (
    <div className="cw-workflow-fields">
      <WorkflowField label="Report" value="BE-11 Annual Survey" />
      <WorkflowField label="Period" value="Fiscal year 2025" />
      <WorkflowField label="Filing due" value="July 10, 2026" />
      <WorkflowField label="Readiness target" value="June 19, 2026" />
      <WorkflowField label="Controller" value="Sarah Chen" />
      <WorkflowField label="Reminder policy" value="7, 3, and 1 day" />
    </div>
  );
}

function WorkflowField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ScopeArtifact({ onOpenManual }: { onOpenManual: () => void }) {
  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Scope & forms</span>
          <h3>42 affiliates evaluated</h3>
          <p>40 ready · 2 need a person · rule pack BE-11.2026.2</p>
        </div>
        <span className="cw-artifact-score">95%</span>
      </div>
      <div className="cw-scope-summary">
        <div>
          <strong>40</strong>
          <span>Ready</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Needs review</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Blocked</span>
        </div>
      </div>
      <div className="cw-table">
        <div className="cw-table-head">
          <span>Entity</span>
          <span>Outcome</span>
          <span>Status</span>
        </div>
        {scopeRows.map(([entity, form, status, confidence]) => (
          <div className="cw-table-row" key={entity}>
            <span>
              <strong>{entity}</strong>
              <small>{confidence} confidence</small>
            </span>
            <span>{form}</span>
            <span
              className={status === "Ready" ? "cw-ready" : "cw-needs-review"}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open all 42 entities
        <Icon name="external" size={15} />
      </button>
    </div>
  );
}

function MappingArtifact({ onOpenManual }: { onOpenManual: () => void }) {
  const rows = [
    ["Total assets", "NetSuite · Assets", "Mapped"],
    ["Sales", "NetSuite · Revenue", "Mapped"],
    ["Net income", "Consolidation · NI", "Mapped"],
    ["Employee count", "HRIS · Active FTE", "Mapped"],
    ["Intercompany debt", "Treasury workbook", "Needs evidence"],
  ];
  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Mapping & collection</span>
          <h3>18 required fields mapped</h3>
          <p>14 complete · 4 governed requests · 0 overdue</p>
        </div>
        <span className="cw-artifact-score">78%</span>
      </div>
      <div className="cw-table">
        <div className="cw-table-head">
          <span>BE-11 field</span>
          <span>Governed source</span>
          <span>Status</span>
        </div>
        {rows.map(([field, source, status]) => (
          <div className="cw-table-row" key={field}>
            <span>
              <strong>{field}</strong>
            </span>
            <span>{source}</span>
            <span
              className={status === "Mapped" ? "cw-ready" : "cw-needs-review"}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open full mapping workspace
        <Icon name="external" size={14} />
      </button>
    </div>
  );
}

function FormsArtifact({ onOpenManual }: { onOpenManual: () => void }) {
  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Form review</span>
          <h3>40 forms prepared</h3>
          <p>38 standard review · 2 high-judgment forms</p>
        </div>
        <span className="cw-artifact-score">95%</span>
      </div>
      <div className="cw-record-list">
        {[
          ["Germany Manufacturing GmbH", "BE-11B · Ready"],
          ["Meridian Trading Pte", "BE-11B · Ready"],
          ["Brazil Services Ltda", "BE-11B · Review scope change"],
          ["Dutch Peak Innovations", "BE-11C · Review not-filing reversal"],
        ].map(([name, detail]) => (
          <div key={name}>
            <span className="cw-record-dot" />
            <div>
              <strong>{name}</strong>
              <small>{detail}</small>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open all forms
        <Icon name="external" size={14} />
      </button>
    </div>
  );
}

function PackageArtifact({ onOpenManual }: { onOpenManual: () => void }) {
  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Filing package</span>
          <h3>BEA package v12</h3>
          <p>40 forms · 128 evidence links · final approval signed</p>
        </div>
        <span className="cw-artifact-score">100%</span>
      </div>
      <div className="cw-check-list">
        {[
          ["Package hash", "4ef7…91ac"],
          ["Rule pack", "BE-11.2026.2"],
          ["Blueprint", "Version 4"],
          ["Authorized approver", "Julie Ruiz"],
          ["Transmission", "Ready for BEA"],
        ].map(([name, detail]) => (
          <div key={name}>
            <span className="cw-agent-check">
              <Icon name="check" size={12} />
            </span>
            <span>
              <strong>{name}</strong>
              <small>{detail}</small>
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open filing workspace
        <Icon name="external" size={14} />
      </button>
    </div>
  );
}

function ReadinessArtifact({
  approved,
  allowApproval,
  onApprove,
  onOpenManual,
}: {
  approved: boolean;
  allowApproval: boolean;
  onApprove: () => void;
  onOpenManual: () => void;
}) {
  const checks = [
    ["Scope complete", "42 of 42 outcomes accounted for"],
    ["Required fields", "All blocking fields populated"],
    ["Evidence", "128 source links attached"],
    ["Validation", "0 blocking errors · 3 resolved warnings"],
    ["Package", "BEA package v12 staged"],
  ];

  return (
    <div className="cw-artifact">
      <div className="cw-readiness-hero">
        <div className="cw-readiness-ring">
          <strong>{approved ? "100" : "92"}</strong>
          <span>%</span>
        </div>
        <div>
          <span className="cw-eyebrow">Final readiness</span>
          <h3>{approved ? "Approved" : "Ready for approval"}</h3>
          <p>
            {approved
              ? "The governed decision is committed to the project record."
              : "All machine-verifiable checks passed. One human signature remains."}
          </p>
        </div>
      </div>
      <div className="cw-check-list">
        {checks.map(([name, detail]) => (
          <div key={name}>
            <span className="cw-agent-check">
              <Icon name="check" size={12} />
            </span>
            <span>
              <strong>{name}</strong>
              <small>{detail}</small>
            </span>
          </div>
        ))}
      </div>
      <div className={`cw-signature ${approved ? "is-approved" : ""}`}>
        <span className="cw-eyebrow">
          {approved ? "Signed" : "Human control"}
        </span>
        <strong>
          {approved ? "Approved by Julie Ruiz" : "Final package approval"}
        </strong>
        <p>
          Identity, role, timestamp, package hash, blueprint, and rule-pack
          versions are recorded together.
        </p>
        {!approved && allowApproval && (
          <button
            type="button"
            className="cw-button cw-button-primary"
            onClick={onApprove}
          >
            Approve package
          </button>
        )}
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open judgment ledger
        <Icon name="external" size={15} />
      </button>
    </div>
  );
}

function RecordArtifact({ onOpenManual }: { onOpenManual: () => void }) {
  return (
    <div className="cw-artifact">
      <div className="cw-artifact-title">
        <div>
          <span className="cw-eyebrow">Durable project record</span>
          <h3>How this filing was produced</h3>
          <p>People, agents, evidence, decisions, and governed changes</p>
        </div>
      </div>
      <div className="cw-record-list">
        {auditRows.map(([time, actor, event]) => (
          <div key={`${time}-${event}`}>
            <span className="cw-record-line">
              <i />
            </span>
            <div>
              <span>{time}</span>
              <strong>{event}</strong>
              <small>{actor}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="cw-record-note">
        <Icon name="records" size={18} />
        <p>
          This shared thread and its structured outputs form one canonical,
          exportable audit record—not a private chat transcript.
        </p>
      </div>
      <button type="button" className="cw-canvas-action" onClick={onOpenManual}>
        Open complete audit trail
        <Icon name="external" size={15} />
      </button>
    </div>
  );
}
