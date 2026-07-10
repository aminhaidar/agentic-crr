# CLAUDE.md

Guidance for AI coding assistants (Claude Code, Cursor, subagents) working in
this repo. Adapted from `solution-enablement`'s conventions, kept to what
actually applies here. When something conflicts, this file wins for this repo.

## What this repo is

**Agentic CRR — Regulatory Filing Operator.** A standalone **Vite + React 18 +
TypeScript + Tailwind v3 + shadcn/ui** prototype. It is a **distinct product**
from base CRR (the `solution-enablement` monorepo), intended to be handed to an
engineer to build on — not a feature branch of base CRR.

- **Fully mocked: no backend, no database.** All filing data lives in the engine
  fixtures. The one real external seam is the Operator agent (see below).
- Ships two ways: a standalone SPA (`pnpm dev`, :5174) and a **Workiva
  microfrontend** that appears as the **"Agentic CRR"** tab in the Wdesk nav
  (`pnpm dev:mfe`, :8080), exactly like Regulatory Filing loads
  `solution-enablement`.

## Commands

```bash
pnpm install --ignore-workspace   # standalone install (not a workspace member)

pnpm dev            # standalone SPA → http://localhost:5174 (mocked, no login)
pnpm dev:mfe        # MFE inside the real Wdesk shell → http://localhost:8080
                    #   (fetches staging.wdesk.org, log in, pick "Agentic CRR")
pnpm build          # strict tsc gate + standalone production build
pnpm build:mfe      # tsc gate + MFE bundle → dist-mfe/ (deployable extension)
pnpm check          # format:check + lint + test:run + build  ← the quality gate
pnpm test:run       # Vitest once     |  pnpm lint  |  pnpm typecheck
```

**Definition of done = `pnpm check` is green.** A husky **pre-commit hook** also
runs `lint-staged` (Prettier + ESLint on staged files) and **blocks commits to
`main`/`master`** — the same git hygiene as `solution-enablement`, scoped to a
single package here. `pnpm check` is the full gate; the hook is the fast
per-commit one. When a change is observable in the browser, also verify behavior
in the running app (drive the flow, read the DOM/console) — don't rely on the
build passing alone.

## Architecture

Clean/hexagonal, dependency pointing inward:

```
domain/            pure types + logic (report, workflow, filing, conversation, text)
application/ports/ interfaces the app depends on (ReportRepository, WorkflowRepository, OperatorAgent)
infrastructure/    adapters implementing the ports (InMemory*, Http/MockOperatorAgent)
providers/         React context DI (one Provider + use* hook per port)
features/          UI that consumes ports via TanStack Query hooks
```

- **The engine (`src/engine/legacy.ts`) is the ported prototype**: it renders
  `shell.html` via `dangerouslySetInnerHTML` and drives the DOM imperatively
  through `window` globals (`go`, `openReport`, `RPT`, …). React chrome is
  layered on top in `src/components/shell/ChromeEnhancements.tsx`.
- **Bridges between React and the engine** (typed in `src/types/window.d.ts`):
  - **Reports / Workflow** — repositories are the single source of truth; the
    engine and the React dialog both funnel through `reportRepository.create`.
  - **OperatorAgent** — the composer calls a read-only `OperatorAgent` port.
    `MockOperatorAgent` is the default; set `VITE_OPERATOR_AGENT_URL` to switch
    to `HttpOperatorAgent` (ml-agent-service stored-agent route). One env var is
    the whole "go live" switch.
  - **Filing snapshot** — the conversational Operator is a _lens over the real
    filing_ (`RPT`), not a simulation. The engine exposes
    `__opEnterFiling` / `__opFilingSnapshot` / `__opRevealManual` and fires
    `__opFilingChanged` after each render; React reads it via `useFilingSnapshot`.
    The Operator must **drive real engine actions**, never a parallel storyboard.
- **Microfrontend** (`manifest.yaml` + `src/mfe/`): `entrypoint.ts` →
  `contribution.ts` → `experience.tsx` mounts `<App/>` into the Wdesk drawer.
  Built separately (`vite.mfe.config.ts`) so the standalone build stays intact.

See `docs/architecture.md`, `docs/design-system.md`, and
`docs/operator-conversational-workspace.md` for deeper detail.

## Careful zones — the verbatim prototype

`src/engine/legacy.ts`, `src/shell.html`, `src/styles/prototype.css`, and
`src/data/docs_raw.json` are the prototype carried over **verbatim** and are
**excluded from Prettier/ESLint** (see `.prettierignore`, `eslint.config.js`).
Edit them surgically to preserve behavior — do **not** reformat or rewrite them
wholesale, and match the surrounding style when adding to them.

## Conventions

- **TypeScript strict, no `any`.** Validate at boundaries; fail fast with clear
  messages.
- **Double quotes**, named exports, `import type` for type-only imports — all
  enforced by Prettier + ESLint (`pnpm format` / `pnpm lint`).
- Functional components with hooks; prefix handlers with `handle`/`on`.
- State ladder: `useState` → lift → context → external store. Server-shaped
  reads go through **TanStack Query** hooks over a port, not ad-hoc fetches.
- Keep new code idiomatic to its neighbors — match comment density and naming.

## Testing

**Vitest** + `@testing-library/react` + jsdom. Co-locate tests as
`Name.test.ts(x)`. Minimal mocking — prefer real components and real port
adapters (e.g. `MockOperatorAgent`, `InMemory*Repository`); mock only what you
don't control. Cover ports/adapters and hooks.

## Microfrontend integration

Uses `@workiva/microfrontend` + `@workiva/vite-plugin-microfrontend`, modeled on
`solution-enablement/packages/solutions`. The private `@workiva/*` packages
install from Workiva's Artifactory registry (`.npmrc`; token read from your
user-level `~/.npmrc`). The `manifest.yaml` `core.navigation_sidebar`
contribution is the "Agentic CRR" nav tab. When editing it, keep the names in
`manifest.yaml` (`agentic_crr_extension` / `agentic_crr_drawer`) in sync with
`src/mfe/contribution.ts`.

## Git & delivery

- Branch: `main` (origin `aminhaidar-wk/agentic-crr`). **Commit or push only
  when the user asks.** If asked while on `main`, branch first — the pre-commit
  hook enforces this (`git switch -c <type>/<short-name>`).
- Small, single-purpose, conventional commits (`feat/fix/chore/test/docs`);
  minimal, idiomatic, low-noise diffs. Anything committed/pushed must be
  senior-level and clean. No force-push without explicit OK.
- End commit messages with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- Use a separate git worktree when another agent may be editing this tree, to
  avoid clobbering.
