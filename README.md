# Agentic CRR — Regulatory Filing Operator (TypeScript app)

A standalone **React + TypeScript + Vite** build of the `prototype-operator.html`
concept, using **shadcn/ui** as the design system while preserving the
prototype's exact visual language. Fully mocked — **no backend, no database.**

## Run it

Standalone (fastest — mocked, no login):

```bash
pnpm install --ignore-workspace
pnpm dev          # http://localhost:5174
```

### Inside the Workiva shell (as the "Agentic CRR" tab, with real login)

This app also ships as a Workiva microfrontend (`manifest.yaml` + `src/mfe/`),
so it appears as its own **Agentic CRR** tab in the Wdesk nav — the same way
Regulatory Filing loads `solution-enablement`.

```bash
pnpm dev:mfe      # serves the MFE on :8080 and loads the real Wdesk shell
```

Then open **http://localhost:8080**. The `@workiva/vite-plugin-microfrontend`
serve-tool fetches the live Wdesk app shell (defaults to `staging.wdesk.org`)
and injects this local MFE, so you **log in with your normal Wdesk credentials**
and select **Agentic CRR** in the left nav. Requires access to the private
Workiva npm registry (`.npmrc`) — the auth token is read from your user-level
`~/.npmrc`. `pnpm build:mfe` produces the deployable bundle in `dist-mfe/`.

Other scripts:

```bash
pnpm build        # strict tsc gate + production build
pnpm check        # formatting + lint + tests + production build
pnpm lint         # ESLint for maintained TypeScript/React modules
pnpm test:run     # run the Vitest suite once
pnpm typecheck    # tsc --noEmit
pnpm preview      # preview the production build
```

CI runs the same `pnpm check` gate plus a production dependency audit. The
verbatim prototype files (`legacy.ts`, `shell.html`, `prototype.css`, and the
embedded docs fixture) are intentionally excluded from automated formatting;
newly extracted engine modules are fully typed, linted, formatted, and tested.

## How it's built

The source prototype is a single 5,400-line HTML file: ~1,900 lines of
hand-authored CSS design tokens and ~3,000 lines of imperative, `innerHTML`-driven
view logic across ~15 views (Operator launchpad, Portfolio, Projects, a full
report **lifecycle engine**, a session chat thread, Agents & Skills, Artifacts,
Schedules, Sources, Settings, and a Markdown + Mermaid product-docs viewer).

To reproduce it **exactly** as a TypeScript app on shadcn without behavioral
drift, the app is layered:

| Layer                     | What                                                                                                                                                                                             | Where                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **Design system**         | shadcn/ui primitives (`Button`, `Dialog`, `DropdownMenu`, `Tooltip`, `Switch`) with Tailwind. Their theme tokens are wired to the prototype's tokens so shadcn renders pixel-identically.        | `src/components/ui/*`, `tailwind.config.ts` |
| **Exact styling**         | The prototype's complete stylesheet, imported verbatim — it owns the visual language.                                                                                                            | `src/styles/prototype.css`                  |
| **Shell**                 | The prototype's exact markup (DOM, inline SVGs, ids/classes) so the engine's expectations are preserved byte-for-byte.                                                                           | `src/shell.html` (via `?raw`)               |
| **Engine**                | The proven prototype logic, ported into a typed module and driven via handlers on `window`. Renders view content into React-owned containers.                                                    | `src/engine/legacy.ts`                      |
| **React + shadcn chrome** | Discrete interactions rebuilt as real shadcn components (e.g. the **New report** modal is a shadcn `Dialog` styled with the prototype's `.modal` classes, wired to the engine's `createReport`). | `src/components/shell/*`                    |
| **Docs data**             | The embedded product-memory Markdown, extracted to JSON.                                                                                                                                         | `src/data/docs_raw.json`                    |

This keeps the demo faithful (identical styling + behavior) while establishing a
real TypeScript + shadcn foundation to extend view-by-view.

## Architecture direction

Operator is a standalone next-generation product that will integrate with
compatible Workiva and CRR services without being built on the existing CRR
frontend. New workflows follow domain/application/infrastructure boundaries;
`src/engine/legacy.ts` is a temporary compatibility adapter that shrinks as each
vertical slice moves to typed React modules.

See [`docs/architecture.md`](docs/architecture.md) for dependency rules, Workiva
integration boundaries, and the legacy retirement sequence.

## Notes

- All data is static fixtures inside the engine — nothing is persisted or fetched.
- Product-docs diagrams render with Mermaid (loaded via the `mermaid` package).
- Not statutory-accurate; affiliates/figures are illustrative fixtures.
