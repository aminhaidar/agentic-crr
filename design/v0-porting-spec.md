# v0 → Agentic CRR porting spec

Paste this into v0 as context so whatever it designs drops straight into our
codebase. The goal: **one self-contained React component** we port into
`src/features/operator-nav/OperatorSidebar.tsx`.

## Rules for v0

- Output **one component** (the nav), not a whole-app rewrite. Keep it isolated.
- Build it from **Workiva Unify** components (Unify = Workiva's MUI-based system).
  Import from `@workiva/unify`. If your sandbox can't install it, approximate
  with MUI/shadcn but keep the **same component names + `sx` props** so the port
  is mechanical.
- All styling via the MUI **`sx`** prop (no external CSS files, no Tailwind
  classes we'd have to convert).
- Wrap the component tree in `<UnifyThemeProvider>` (from `@workiva/unify`).

## Components available (import from `@workiva/unify`)

`Box, Stack, Button, IconButton, ListItemButton, Typography, Tooltip, Popover,
Divider, Chip, Paper, UnifyThemeProvider`

## Tokens / colors (dark navy rail)

```
--app-rail:        #1a2942   /* rail background — tune to match Wdesk's nav */
--accent:          #4a8eff   /* Workiva blue (primary Button) */
--text:            #ffffff
--text-dim:        rgba(255,255,255,0.72)
--hover:           rgba(255,255,255,0.07)
--selected:        rgba(255,255,255,0.12)
--operator-bg:     rgba(74,142,255,0.14)   /* Operator flagship tint */
--operator-active: rgba(74,142,255,0.26)
--operator-icon:   #7fb2ff
--divider:         rgba(255,255,255,0.09)
```

## Wire interactions to these (they already exist on `window`)

| Action                | Call                                                          |
| --------------------- | ------------------------------------------------------------ |
| Navigate: Operator    | `window.go("home")`                                          |
| Navigate: Portfolio   | `window.go("dashboard")`                                     |
| Navigate: Projects    | `window.go("filings")`                                       |
| Navigate: Sources     | `window.go("sources")`                                       |
| Navigate: Settings    | `window.go("settings")`                                      |
| Start a report (agentic) | `window.openReport("be11" \| "be577" \| "be125" \| ...)` |
| Collapse the rail     | `window.toggleWorkspaceNav()`                                |
| Which item is active  | `const active = useCurrentView()` → returns the nav key      |

`useCurrentView()` returns one of: `"home" | "dashboard" | "filings" |
"sources" | "settings"`. Highlight the item whose key matches.

Report types for the "Start report" picker come from
`window.__OP_DATA.OB_TYPES` — a `Record<string, { code: string; short: string }>`
(e.g. `{ be11: { code: "BE-11", short: "Direct Investment Abroad" }, ... }`).

## Structure we're refining (change the design, keep these anchors)

1. Top row: **Start report** (primary Button, opens a report-type picker) +
   a **collapse** IconButton.
2. **Operator** — the flagship AI surface. Make it feel special (accent), set
   apart from the plain nav. Selected → `window.go("home")`.
3. Utility nav: **Portfolio, Projects, Sources**.
4. Spacer, then **Settings** anchored to the bottom.
5. Collapsing fully hides the rail (full-screen content).

## What to send back

The component code **and/or** a screenshot of each direction. I'll translate to
real Unify + wire `window.go` / `window.openReport` and drop it into the
integrated branch. Don't open a PR / merge from v0 — it's built on stale `main`.
