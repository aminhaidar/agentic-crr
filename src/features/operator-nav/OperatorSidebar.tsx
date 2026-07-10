import { type ReactNode, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@workiva/unify";
import { UnifyProvider } from "@/providers/UnifyProvider";
import { useCurrentView } from "./useCurrentView";

/**
 * The Operator's left navigation on Workiva Unify — a Workiva-navy rail (like
 * Wdesk's own nav). Start report + a collapse control sit in a compact top row;
 * Operator is a clean accented entry above the utility nav; Settings anchors the
 * bottom. Collapsing fully hides the rail (a floating toggle reopens it). Drives
 * the engine via window.go() / window.openReport().
 */

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
  projects: (
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
  {
    nav: "dashboard",
    view: "dashboard",
    label: "Portfolio",
    icon: "portfolio",
  },
  { nav: "filings", view: "filings", label: "Projects", icon: "projects" },
  { nav: "sources", view: "sources", label: "Sources", icon: "sources" },
];

const navItemSx = {
  borderRadius: "8px",
  minHeight: 42,
  px: 1.25,
  gap: 1.25,
  color: "rgba(255,255,255,0.72)",
  "& svg": { opacity: 0.85 },
  "&:hover": { bgcolor: "rgba(255,255,255,0.07)", color: "#fff" },
  "&.Mui-selected": {
    bgcolor: "rgba(255,255,255,0.12)",
    color: "#fff",
    "& svg": { opacity: 1 },
  },
  "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.16)" },
};

// Operator is the flagship — a clean blue-accented entry, distinct from the
// plain utility nav without shouting.
const operatorSx = {
  borderRadius: "8px",
  minHeight: 44,
  px: 1.25,
  gap: 1.25,
  color: "#fff",
  bgcolor: "rgba(74,142,255,0.14)",
  "& svg": { color: "#7fb2ff", opacity: 1 },
  "&:hover": { bgcolor: "rgba(74,142,255,0.2)" },
  "&.Mui-selected": { bgcolor: "rgba(74,142,255,0.26)" },
  "&.Mui-selected:hover": { bgcolor: "rgba(74,142,255,0.32)" },
};

function RailItem({
  label,
  icon,
  selected,
  onClick,
  sx,
}: {
  label: string;
  icon: keyof typeof icons;
  selected: boolean;
  onClick: () => void;
  sx: object;
}) {
  return (
    <ListItemButton selected={selected} onClick={onClick} sx={sx}>
      <NavIcon name={icon} size={selected && sx === operatorSx ? 20 : 19} />
      <Typography
        sx={{ fontSize: 14, fontWeight: sx === operatorSx ? 600 : 500 }}
      >
        {label}
      </Typography>
    </ListItemButton>
  );
}

interface ReportType {
  code: string;
  short: string;
}

function reportTypes(): [string, ReportType][] {
  const types = (window.__OP_DATA?.OB_TYPES ?? {}) as Record<
    string,
    ReportType
  >;
  return Object.entries(types);
}

export function OperatorSidebar() {
  const active = useCurrentView();
  const [reportAnchor, setReportAnchor] = useState<HTMLElement | null>(null);

  const startReport = (type: string) => {
    setReportAnchor(null);
    window.openReport?.(type);
  };

  return (
    <UnifyProvider>
      <Stack sx={{ height: "100%", px: 1.5, py: 1.5, gap: 0.5 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={(event) => setReportAnchor(event.currentTarget)}
            sx={{ minHeight: 40, gap: 0.75, borderRadius: "10px" }}
          >
            <NavIcon name="plus" size={18} />
            Start report
          </Button>
          <Tooltip title="Collapse navigation" placement="bottom">
            <IconButton
              onClick={() => window.toggleWorkspaceNav?.()}
              size="small"
              aria-label="Collapse navigation"
              sx={{
                color: "rgba(255,255,255,0.62)",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <NavIcon name="panel" size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Popover
          open={Boolean(reportAnchor)}
          anchorEl={reportAnchor}
          onClose={() => setReportAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Stack sx={{ p: 0.5, minWidth: 260 }}>
            <Typography
              sx={{ px: 1.25, py: 0.75, fontSize: 12, color: "text.secondary" }}
            >
              Start a new report
            </Typography>
            {reportTypes().map(([key, report]) => (
              <ListItemButton
                key={key}
                onClick={() => startReport(key)}
                sx={{ borderRadius: "8px", gap: 1.25, py: 1 }}
              >
                <Box
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "6px",
                    bgcolor: "action.selected",
                    whiteSpace: "nowrap",
                  }}
                >
                  {report.code}
                </Box>
                <Typography sx={{ fontSize: 14 }}>{report.short}</Typography>
              </ListItemButton>
            ))}
          </Stack>
        </Popover>

        <Stack component="nav" sx={{ gap: 0.25, mt: 0.5 }}>
          <RailItem
            label="Operator"
            icon="operator"
            selected={active === "home"}
            onClick={() => window.go("home")}
            sx={operatorSx}
          />
          {NAV.map((entry) => (
            <RailItem
              key={entry.nav}
              label={entry.label}
              icon={entry.icon}
              selected={active === entry.nav}
              onClick={() => window.go(entry.view)}
              sx={navItemSx}
            />
          ))}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.09)", mb: 0.5 }} />
        <RailItem
          label="Settings"
          icon="settings"
          selected={active === "settings"}
          onClick={() => window.go("settings")}
          sx={navItemSx}
        />
      </Stack>
    </UnifyProvider>
  );
}
