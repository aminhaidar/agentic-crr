/**
 * ============================================================================
 * OperatorSidebar — ANNOTATED REFERENCE for Cursor handoff
 * ============================================================================
 *
 * This is a cleaned-up version of the shared OperatorSidebar that resolves the
 * design-review findings. Diff highlights vs. the original:
 *
 *   #1  Flagship "Operator" entry is now driven by an explicit `variant` prop
 *       ("flagship" | "nav") instead of fragile `sx === operatorSx` identity
 *       checks. Icon size / font weight derive from `variant`.
 *   #2  Selected / hover backgrounds are tokenized (see TOKENS block below) so
 *       the rail can't drift from OperatorHome. A small radius scale is used
 *       instead of ad-hoc 7px / MUI `borderRadius: 2`.
 *   #3  Selected nav icon uses --op-interactive-strong (#0062b8) for reliable
 *       >=3:1 contrast on the tinted selected background.
 *   #4  Recent rows show status + relative time instead of the repeated,
 *       low-value "Continue conversation" secondary line.
 *   #10 The global integration surface is typed on `window` (see the
 *       declaration at the bottom) so the contract with the prototype engine
 *       is explicit and type-checked.
 *
 * TOKENS to add to index.css (values mirror OperatorHome intent):
 *   --op-interactive:          #0075db;   // primary blue (rest)
 *   --op-interactive-strong:   #0062b8;   // darker blue (selected icon / hover)
 *   --op-interactive-selected: rgba(0,117,219,0.12); // selected nav bg
 *   --op-interactive-selected-hover: rgba(0,117,219,0.18);
 *   --op-interactive-flagship: rgba(0,117,219,0.16);       // flagship selected
 *   --op-interactive-flagship-hover: rgba(0,117,219,0.22);
 *   --op-radius-sm:  7px;   // rail items
 *   --op-radius-md:  10px;  // buttons / menu items
 *   --op-radius-lg:  14px;  // header tile / brand
 *
 * GRID CONTRACT (rows, top -> bottom):
 *   56px  brand + collapse toggle (matches footer height)
 *   64px  "Start report" action
 *   auto  primary nav (Operator + 3 utility destinations)
 *   1fr   "Continue with Operator" — the ONLY scrolling region
 *   56px  Settings (fixed)
 * ============================================================================
 */

import { type ReactNode, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useReportsQuery } from "@/features/reports/reportQueries";
import { useCurrentView } from "./useCurrentView";

const icons: Record<string, ReactNode> = {
  operator: (
    <path
      d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z"
      strokeLinejoin="round"
    />
  ),
  portfolio: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  // NOTE: folder glyph maps to "Reports". Confirm this metaphor is intentional
  // (a folder reads more like "Projects/Files" than a set of reports).
  reports: (
    <path d="M4 6.5A1.5 1.5 0 015.5 5H10l2 2h6.5A1.5 1.5 0 0120 8.5V18a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18z" />
  ),
  sources: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </>
  ),
  settings: (
    <>
      <line x1="4" y1="8" x2="20" y2="8" />
      <circle cx="9" cy="8" r="2.4" fill="currentColor" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="15" cy="16" r="2.4" fill="currentColor" />
    </>
  ),
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  chevron: (
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  conversation: (
    <>
      <path d="M5.5 5.5h13A2.5 2.5 0 0121 8v7a2.5 2.5 0 01-2.5 2.5H11L6 21v-3.5h-.5A2.5 2.5 0 013 15V8a2.5 2.5 0 012.5-2.5z" />
      <line x1="7" y1="10" x2="17" y2="10" />
      <line x1="7" y1="13.5" x2="14" y2="13.5" />
    </>
  ),
};

function NavIcon({
  name,
  size = 19,
}: {
  name: keyof typeof icons;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {icons[name]}
    </svg>
  );
}

interface NavEntry {
  nav: string;
  view: string;
  label: string;
  icon: keyof typeof icons;
}

const NAV: NavEntry[] = [
  { nav: "dashboard", view: "dashboard", label: "Portfolio", icon: "portfolio" },
  { nav: "filings", view: "filings", label: "Reports", icon: "reports" },
  { nav: "sources", view: "sources", label: "Data sources", icon: "sources" },
];

// ---- Item styles: shared base + tokenized selected/hover -------------------
const railItemBase = {
  borderRadius: "var(--op-radius-sm)",
  px: 1.25,
  gap: 1.25,
  color: "var(--op-text-2)",
  "& svg": { color: "var(--op-text-3)" },
  "&:hover": { bgcolor: "var(--op-surface-3)", color: "var(--op-text-1)" },
};

const navItemSx = {
  ...railItemBase,
  minHeight: 38,
  "&.Mui-selected": {
    bgcolor: "var(--op-interactive-selected)",
    color: "var(--op-text-1)",
    "& svg": { color: "var(--op-interactive-strong)" }, // #3 contrast fix
  },
  "&.Mui-selected:hover": { bgcolor: "var(--op-interactive-selected-hover)" },
};

// Operator is the flagship — same shape, slightly stronger tint + a bit taller.
const flagshipItemSx = {
  ...railItemBase,
  minHeight: 40,
  "&.Mui-selected": {
    bgcolor: "var(--op-interactive-flagship)",
    color: "var(--op-text-1)",
    "& svg": { color: "var(--op-interactive-strong)" }, // #3 contrast fix
  },
  "&.Mui-selected:hover": { bgcolor: "var(--op-interactive-flagship-hover)" },
};

const recentItemSx = {
  borderRadius: "var(--op-radius-sm)",
  minHeight: 48,
  px: 1.25,
  py: 0.5,
  gap: 1,
  color: "var(--op-text-2)", // #2 explicit color (was inherited/undefined)
  "&:hover": { bgcolor: "var(--op-surface-3)" },
};

type RailVariant = "flagship" | "nav";

function RailItem({
  label,
  icon,
  selected,
  onClick,
  variant = "nav",
}: {
  label: string;
  icon: keyof typeof icons;
  selected: boolean;
  onClick: () => void;
  variant?: RailVariant;
}) {
  const isFlagship = variant === "flagship"; // #1 explicit, not sx identity
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      aria-current={selected ? "page" : undefined}
      sx={{ ...(isFlagship ? flagshipItemSx : navItemSx), flex: "0 0 auto" }}
    >
      <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
        <NavIcon name={icon} size={isFlagship ? 20 : 19} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 14,
          fontWeight: isFlagship ? 600 : 500,
          lineHeight: 1.3,
        }}
      />
    </ListItemButton>
  );
}

interface ReportType {
  code: string;
  short: string;
}

function reportTypes(): [string, ReportType][] {
  const types = (window.__OP_DATA?.OB_TYPES ?? {}) as Record<string, ReportType>;
  return Object.entries(types);
}

// #4 Lightweight relative-time helper for the recent rows.
function relativeTime(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function OperatorSidebar() {
  const active = useCurrentView();
  const [reportAnchor, setReportAnchor] = useState<HTMLElement | null>(null);
  const reportsQuery = useReportsQuery();

  // Product rule: "recent" = the most recent non-filed sessions, capped at 4.
  // Consider hoisting this into useOperatorHome so the rail + home agree on
  // what "active" means (#5).
  const recentSessions = (reportsQuery.data ?? [])
    .filter((report) => report.status !== "done")
    .slice(0, 4);

  const startReport = (type: string) => {
    setReportAnchor(null);
    window.openReport?.(type);
  };

  // Navigating from the rail always dismisses an open conversation first, so the
  // persistent rail works as the one nav even while a conversation is docked.
  const navigate = (view: string) => {
    window.__exitConversationalProject?.();
    window.go(view);
  };

  return (
    <Box
      component="nav"
      aria-label="Agentic Reporting"
      sx={{
        display: "grid",
        // 56 brand · 64 action · auto nav · 1fr scroll · 56 settings
        gridTemplateRows: "56px 64px auto minmax(0, 1fr) 56px",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        bgcolor: "var(--op-surface-1)",
        color: "var(--op-text-1)",
      }}
    >
      {/* Row 1 — brand + collapse toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          borderBottom: "1px solid var(--op-border-2)",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "var(--op-radius-lg)",
            background: "linear-gradient(150deg,#2f8fe0,#0062b8)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          A
        </Box>
        <Typography
          noWrap
          sx={{ minWidth: 0, flex: 1, fontSize: 14, fontWeight: 700 }}
        >
          Agentic Reporting
        </Typography>
        <Tooltip title="Hide navigation" placement="bottom">
          <IconButton
            onClick={() => window.toggleWorkspaceNav?.()}
            aria-label="Hide Agentic Reporting navigation"
            sx={{
              width: 32,
              height: 32,
              color: "var(--op-text-3)",
              borderRadius: "var(--op-radius-md)",
              "&:hover": {
                color: "var(--op-text-1)",
                bgcolor: "var(--op-surface-3)",
              },
            }}
          >
            <NavIcon name="panel" size={17} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Row 2 — Start report */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: "1px solid var(--op-border-2)",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={(event) => setReportAnchor(event.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(reportAnchor)}
          aria-controls={reportAnchor ? "start-report-menu" : undefined}
          sx={{
            minHeight: 40,
            borderRadius: "var(--op-radius-md)",
            justifyContent: "space-between",
            px: 1.5,
            textTransform: "none",
            boxShadow: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <NavIcon name="plus" size={17} />
            Start report
          </Box>
          <NavIcon name="chevron" size={15} />
        </Button>
      </Box>

      {/* MUI Menu traps focus, closes on Escape, and returns focus to the
          anchor button on close (#7 — verified default behavior). */}
      <Menu
        id="start-report-menu"
        open={Boolean(reportAnchor)}
        anchorEl={reportAnchor}
        onClose={() => setReportAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 260 } } }}
      >
        <Typography
          sx={{
            px: 2,
            py: 1,
            fontSize: 12,
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          Start a new report
        </Typography>
        {reportTypes().map(([key, report]) => (
          <MenuItem
            key={key}
            onClick={() => startReport(key)}
            sx={{
              mx: 0.5,
              minHeight: 44,
              borderRadius: "var(--op-radius-md)",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: 0.75,
                py: 0.25,
                borderRadius: "var(--op-radius-sm)",
                bgcolor: "action.selected",
                whiteSpace: "nowrap",
              }}
            >
              {report.code}
            </Box>
            <Typography sx={{ fontSize: 14 }}>{report.short}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Row 3 — primary nav */}
      <List
        disablePadding
        sx={{ px: 2, py: 1, borderBottom: "1px solid var(--op-border-2)" }}
      >
        <RailItem
          label="Operator"
          icon="operator"
          selected={active === "home"}
          onClick={() => navigate("home")}
          variant="flagship"
        />
        {NAV.map((entry) => (
          <RailItem
            key={entry.nav}
            label={entry.label}
            icon={entry.icon}
            selected={active === entry.nav}
            onClick={() => navigate(entry.view)}
            variant="nav"
          />
        ))}
      </List>

      {/* Row 4 — the only scrolling region */}
      <Box
        component="section"
        aria-labelledby="continue-with-operator-heading"
        sx={{
          display: "grid",
          gridTemplateRows: "36px minmax(0, 1fr)",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Typography
          id="continue-with-operator-heading"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2.25,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--op-text-3)",
          }}
        >
          Continue with Operator
        </Typography>
        <List
          disablePadding
          sx={{
            minHeight: 0,
            overflowY: "auto",
            px: 1,
            pb: 1,
            scrollbarGutter: "stable",
          }}
        >
          {reportsQuery.isLoading && (
            <Typography sx={{ px: 1.25, py: 1.5, fontSize: 12, color: "text.secondary" }}>
              Loading activity…
            </Typography>
          )}
          {reportsQuery.isError && (
            <Typography sx={{ px: 1.25, py: 1.5, fontSize: 12, color: "text.secondary" }}>
              Recent activity is unavailable.
            </Typography>
          )}
          {!reportsQuery.isLoading &&
            !reportsQuery.isError &&
            recentSessions.length === 0 && (
              <Typography sx={{ px: 1.25, py: 1.5, fontSize: 12, color: "text.secondary" }}>
                No active sessions.
              </Typography>
            )}
          {recentSessions.map((report) => {
            // #4 informative secondary line: status + relative time.
            const when = relativeTime(report.updatedAt);
            const secondary = [report.statusLabel, when]
              .filter(Boolean)
              .join(" · ");
            return (
              <ListItemButton
                key={report.id}
                aria-label={`Continue Operator session for ${report.title}`}
                onClick={() => window.openProject?.(report.id)}
                sx={{ ...recentItemSx, flex: "0 0 48px", height: 48 }}
              >
                <ListItemIcon sx={{ minWidth: 28, color: "var(--op-text-3)" }}>
                  <NavIcon name="conversation" size={16} />
                </ListItemIcon>
                <ListItemText
                  primary={report.title}
                  secondary={secondary || undefined}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.35,
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 11.5,
                    lineHeight: 1.3,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Row 5 — fixed Settings */}
      <List
        disablePadding
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          borderTop: "1px solid var(--op-border-2)",
          bgcolor: "var(--op-surface-1)",
        }}
      >
        <RailItem
          label="Settings"
          icon="settings"
          selected={active === "settings"}
          onClick={() => navigate("settings")}
          variant="nav"
        />
      </List>
    </Box>
  );
}

/**
 * #10 Integration surface contract with the prototype engine.
 * Move this into a shared global.d.ts in the real project.
 */
declare global {
  interface Window {
    go: (view: string) => void;
    openReport?: (type: string) => void;
    openProject?: (id: string) => void;
    toggleWorkspaceNav?: () => void;
    __exitConversationalProject?: () => void;
    __OP_DATA?: {
      OB_TYPES?: Record<string, { code: string; short: string }>;
    };
  }
}
