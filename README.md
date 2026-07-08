# Agentic CRR — Regulatory Filing Operator (TypeScript app)

A standalone **React + TypeScript + Vite** build of the `prototype-operator.html`
concept, using **shadcn/ui** as the design system while preserving the
prototype's exact visual language. Fully mocked — **no backend, no database.**

## Run it

```bash
pnpm install --ignore-workspace
pnpm dev          # http://localhost:5174
```

Other scripts:

```bash
pnpm build        # strict tsc gate + production build
pnpm typecheck    # tsc --noEmit
pnpm preview      # preview the production build
```

## How it's built

The source prototype is a single 5,400-line HTML file: ~1,900 lines of
hand-authored CSS design tokens and ~3,000 lines of imperative, `innerHTML`-driven
view logic across ~15 views (Operator launchpad, Portfolio, Projects, a full
report **lifecycle engine**, a session chat thread, Agents & Skills, Artifacts,
Schedules, Sources, Settings, and a Markdown + Mermaid product-docs viewer).

To reproduce it **exactly** as a TypeScript app on shadcn without behavioral
drift, the app is layered:

| Layer | What | Where |
| --- | --- | --- |
| **Design system** | shadcn/ui primitives (`Button`, `Dialog`, `DropdownMenu`, `Tooltip`, `Switch`) with Tailwind. Their theme tokens are wired to the prototype's tokens so shadcn renders pixel-identically. | `src/components/ui/*`, `tailwind.config.ts` |
| **Exact styling** | The prototype's complete stylesheet, imported verbatim — it owns the visual language. | `src/styles/prototype.css` |
| **Shell** | The prototype's exact markup (DOM, inline SVGs, ids/classes) so the engine's expectations are preserved byte-for-byte. | `src/shell.html` (via `?raw`) |
| **Engine** | The proven prototype logic, ported into a typed module and driven via handlers on `window`. Renders view content into React-owned containers. | `src/engine/legacy.ts` |
| **React + shadcn chrome** | Discrete interactions rebuilt as real shadcn components (e.g. the **New report** modal is a shadcn `Dialog` styled with the prototype's `.modal` classes, wired to the engine's `createReport`). | `src/components/shell/*` |
| **Docs data** | The embedded product-memory Markdown, extracted to JSON. | `src/data/docs_raw.json` |

This keeps the demo faithful (identical styling + behavior) while establishing a
real TypeScript + shadcn foundation to extend view-by-view.

## Notes

- All data is static fixtures inside the engine — nothing is persisted or fetched.
- Product-docs diagrams render with Mermaid (loaded via the `mermaid` package).
- Not statutory-accurate; affiliates/figures are illustrative fixtures.
