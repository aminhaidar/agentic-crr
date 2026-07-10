# Operator as a conversational workspace — design brief

Status: first BE-11 prototype implemented. Companion to `architecture.md`.

## The idea

Turn the Operator home into a conversation-led workspace — like Claude Code —
where a persistent composer drives a filing from zero to filed, prior sessions
reopen as continuable threads, and the side chrome collapses into a focus mode.
Users who want the current dashboard keep it, one toggle away.

## The one adaptation that makes it work here

A coding chat is ephemeral and single-player. A regulatory filing is
**long-lived, multi-person, and auditable**. So the thread is not a throwaway
conversation — it is the **durable record of how the filing was produced**, and
doubles as the audit trail. Two consequences:

1. **Dense artifacts don't belong in chat bubbles.** A 124-entity scope table, a
   form, the readiness report, the portfolio — these need real estate and
   structured interaction. So it is **thread + artifact panel** (like Claude
   Code is chat + the file it's editing), not pure chat.
2. **Governed actions stay.** Filing has irreversible consequences. Keep the
   "agent proposes → shows evidence → human approves → it commits" model. In the
   thread these become **inline approval gates**.

## Layout

```text
┌ workspace nav (one hide/show control) ┬ Operator home or project session ┐
│ Operator / Portfolio / Projects / …   │                                  │
└───────────────────────────────────────┴──────────────────────────────────┘

Active project session:
┌ conversation history ┬ Operator thread ┬ draggable preview ┐
│ opens from one toggle│ narration/gates │ dense artifacts   │
│                      │ [ composer ]     │ opens on demand   │
└──────────────────────┴─────────────────┴───────────────────┘
```

- **Operator home:** starts or resumes work. Quick starts, free-form intent, and
  the Conversations library all enter the same project-session route.
- **Workspace navigation:** global product destinations only. One persistent
  control fully hides or restores it; report sessions and new chats do not
  belong in this navigation.
- **Thread (center):** composer at the bottom; above it the user's asks, agent
  narration, the lifecycle agent-steps (scan, plan, map, validate) as inline
  tool-calls with evidence, approval gates, and hand-off status.
- **Preview (right, on demand):** a docked, draggable structured work surface.
  It pushes the thread rather than covering it on desktop and remembers the
  user's width. It becomes a dismissible sheet only on narrow screens.
- **Top bar:** project name · phase · due date · a toggle to dashboard mode.

## Interaction contract

The thread and preview have different responsibilities:

| Surface          | Owns                                                                                           | Does not own                                  |
| ---------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Operator thread  | intent, narration, progress, evidence summaries, hand-offs, next action, approval gates        | large tables, full forms, bulk comparison     |
| Preview          | source/entity tables, mapping, form review, readiness ledger, package inspection, audit record | conversational narration or a second workflow |
| Manual workspace | expert editing, bulk operations, oversight, exceptional recovery                               | a separate copy of project state              |

The Operator opens the preview when the user must inspect, compare, edit, or
approve structured output. Pure status updates stay in the thread. Closing the
preview never pauses the workflow; the next required structured review may open
it again. Approval remains explicit in the thread even when evidence is
inspected in the preview.

Sessions start thread-first with the preview closed:

- Compact setup, progress, and status updates remain inline.
- Users can open any available artifact from its contextual thread action.
- The Operator automatically opens dense comparison or governance surfaces:
  entity populations, scope plans, mappings, collection requests, form sets,
  judgment ledgers, and filing packages.
- Validation summaries and completed records are suggested rather than forced.
- A user-opened preview stays open as the workflow advances. If the user closes
  it, compact stages do not reopen it.

## Guided project lifecycle

BE-11 currently proves the complete interaction pattern:

1. Source discovery
2. Entity scan and confirmation
3. Project setup proposal
4. Scope planning and sign-off
5. Field mapping
6. Collection and chase
7. Validation and package readiness
8. Form review
9. Final approval
10. Filing transmission
11. Closeout and durable record

One stage definition drives the thread copy, next action, default preview, and
manual-workspace handoff. Other report types should supply report-specific
definitions to this lifecycle rather than creating new navigation or a second
conversation implementation.

## Two modes, one accessible from the other

- **Conversation-led (primary):** composer drives; thread = living record +
  approvals; artifacts open on the side. This is the "feels agentic" experience.
- **Dashboard-led (always one click away):** today's tabbed project workspace,
  for hands-on driving and oversight. Same underlying state — the conversational
  mode is a _lens_, not a replacement. Controllers must not lose structure.

## What maps from Claude Code

| Claude Code                        | Operator                                                        |
| ---------------------------------- | --------------------------------------------------------------- |
| Persistent composer drives the job | Composer drives the filing lifecycle                            |
| Resume a previous session          | Reopen a project's canonical thread (the Conversations library) |
| Collapsible chrome / focus mode    | Hide side nav; bring back in one click                          |
| Chat + the file/diff it edits      | Thread + artifact panel                                         |
| Streaming tool calls               | Agent-step cards (scan/plan/map) with evidence                  |
| —                                  | Governed approval gates before anything commits                 |
| —                                  | Shared, multi-actor thread (hand-offs, "waiting on X")          |

## Risks / decisions

- **Don't trap dense data in chat** — the artifact panel is non-negotiable.
- **Multi-user & async** — the thread is shared project state, not a personal
  DM. Design for hand-offs and "who did what," and for a teammate picking it up.
- **Governance** — keep approve-before-commit explicit; nothing files itself.
- **Don't hide structure too far** — manual/dashboard mode stays first-class and
  complete for oversight.
- **Scope** — this re-architects the primary surface. Prototype the
  conversational workspace for **one report type (BE-11) end-to-end** and
  validate with a controller before committing.

## Fit with the refactor

This vision rides on the clean boundaries in `architecture.md`:

- The thread orchestrates **application use cases**; it does not mutate global
  state. Each lifecycle step (scope, map, validate) becomes a use case behind a
  port, exactly like `createReport`.
- The artifact panel renders **domain** read-models (scope, forms, readiness).
- The audit thread is a natural home for the "activity and audit events"
  integration candidate.
- Sequencing tracks the retirement plan: report read-model → navigation/route
  state → **Operator conversation context** → report lifecycle stages.

## Suggested first slice

1. One report type (BE-11), one project thread, end-to-end.
2. Thread + a single artifact type (the scope table) with an inline approval
   gate.
3. Focus-mode toggle (hide nav) + dashboard-mode toggle, same state.
4. Resume that thread from the Conversations library.
5. Validate with a controller before widening to all stages/report types.

## Prototype implementation

The home surface now implements this first slice in
`src/features/operator-workspace/`:

- resumable filing windows sourced through `ReportRepository`
- focus mode and one-click access to the existing manual workspace
- durable thread framing with agent/tool execution and evidence
- explicit final-package approval gate
- on-demand scope, readiness, and project-record canvas views
- persistent composer with context-aware artifact opening

The lifecycle content is currently a high-fidelity frontend simulation. Backend
engineering still needs to persist thread events, stream agent runs, enforce
authorization, and commit approval/audit events through versioned APIs.
