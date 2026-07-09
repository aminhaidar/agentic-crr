"use client";

/**
 * Agentic CRR — "Operator" home / launchpad.  SELF-CONTAINED v0 SEED.
 * ---------------------------------------------------------------------------
 * This is a fully-mocked, standalone React + Tailwind component (no backend,
 * no external stylesheet, no `window` globals) so v0 can preview and iterate.
 *
 * WHAT THIS SCREEN IS
 *   The home of an agentic regulatory-filing product. The user (a controller)
 *   either types what they want to file, picks a report type, or taps a
 *   suggestion — and "the Operator's" agents take it from there. Below the
 *   composer is their library (past conversations, generated artifacts,
 *   scheduled runs).
 *
 * DESIGN INTENT — please preserve the spirit, improve the craft:
 *   • Dark, immersive "launch stage" — deep navy canvas, soft blue aurora glow,
 *     faint starfield. Calm, premium, agentic. NOT a generic SaaS dashboard.
 *   • The composer is the hero/focal point (think a beautiful AI prompt box).
 *   • Accent = luminous blue (#3f8fe0 / #2f7fd0 / #0b4a80). One restrained hue.
 *
 * CONSTRAINTS (keep these):
 *   • Accessibility: real landmarks, labelled controls, a true tablist with
 *     roving tabindex + arrow keys, focus-visible rings, WCAG-AA text contrast.
 *   • Responsive: works desktop → tablet → 375px mobile.
 *   • All data is illustrative fixtures. Names/figures are made up.
 *
 * IMPROVE FREELY: layout rhythm, motion (entrance, hover, the tab underline),
 * empty states, micro-interactions, typography scale, and the composer polish.
 */

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Sparkles,
  Plus,
  Mic,
  ArrowUp,
  ChevronDown,
  MessageSquare,
  FileText,
  CalendarClock,
  LayoutGrid,
  FolderClosed,
  Database,
  Settings,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------- mock data ------------------------------- */

const QUICK_STARTS = [
  { code: "BE-11", primary: true },
  { code: "BE-577", primary: false },
  { code: "BE-125", primary: false },
];

const MORE_TYPES = [
  { code: "BE-185", name: "Financial Services Transactions" },
  { code: "ABS-1", name: "Annual Business Survey" },
  { code: "AIES", name: "Annual Integrated Economic Survey" },
  { code: "QFR-9", name: "Quarterly Financial Report" },
];

const PROMPTS = [
  "What do we need to file this period?",
  "What needs my approval?",
  "What's due this week?",
  "Compare readiness across my reports",
];

type Tone = "review" | "waiting" | "active" | "filed";
type Row = {
  icon: LucideIcon;
  title: string;
  badge: { label: string; tone: Tone } | null;
  sub: string;
  time: string;
};

const LIBRARY: Record<"conversations" | "artifacts" | "schedules", Row[]> = {
  conversations: [
    { icon: MessageSquare, title: "BE-11 · FY25", badge: { label: "Needs review", tone: "review" }, sub: "Direct Investment Abroad · BEA", time: "2m ago" },
    { icon: MessageSquare, title: "Country-by-Country · FY25", badge: { label: "Waiting", tone: "waiting" }, sub: "Form 8975 · IRS/OECD", time: "38m ago" },
    { icon: MessageSquare, title: "BE-577 · Q2", badge: { label: "Waiting", tone: "waiting" }, sub: "Quarterly Transactions · BEA", time: "5h ago" },
    { icon: MessageSquare, title: "SF-425 · Q2", badge: { label: "Active", tone: "active" }, sub: "Federal Financial Report · GSA", time: "12m ago" },
    { icon: MessageSquare, title: "BE-11 · FY24", badge: { label: "Filed", tone: "filed" }, sub: "Direct Investment Abroad · BEA", time: "Apr 14" },
  ],
  artifacts: [
    { icon: LayoutGrid, title: "BE-11 FY25 Scope Plan", badge: null, sub: "BE-11 · v3 · Scope & Entity agent", time: "today" },
    { icon: FileText, title: "BE-11 FY25 Mapping Table", badge: null, sub: "BE-11 · v2 · Mapping & Resolve agent", time: "today" },
    { icon: FileText, title: "Readiness Report — 92%", badge: null, sub: "BE-11 FY25 · v5 · Validation agent", time: "1h ago" },
    { icon: LayoutGrid, title: "CbCR Scope Plan (draft)", badge: null, sub: "Form 8975 · v1 · Scope & Entity agent", time: "2h ago" },
  ],
  schedules: [
    { icon: CalendarClock, title: "BE-577 quarterly kickoff", badge: { label: "On", tone: "active" }, sub: "Every quarter · last run Apr 2", time: "Apr 2" },
    { icon: CalendarClock, title: "Readiness sweep", badge: { label: "On", tone: "active" }, sub: "Weekly · last run Monday", time: "Mon" },
    { icon: CalendarClock, title: "BE-11 annual prep", badge: { label: "Off", tone: "filed" }, sub: "Annual · last run May 2024", time: "May 2024" },
  ],
};

const TABS = [
  { id: "conversations", label: "Conversations" },
  { id: "artifacts", label: "Artifacts" },
  { id: "schedules", label: "Schedules" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const NAV = [
  { icon: Sparkles, label: "Operator", active: true },
  { icon: LayoutGrid, label: "Portfolio", active: false },
  { icon: FolderClosed, label: "Projects", active: false },
  { icon: Database, label: "Sources", active: false },
];

const BADGE_TONE: Record<Tone, string> = {
  review: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-400/20",
  waiting: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-400/20",
  active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/20",
  filed: "bg-white/10 text-slate-300 ring-1 ring-inset ring-white/10",
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/* ------------------------------- component ------------------------------- */

export default function OperatorHome() {
  const [tab, setTab] = useState<TabId>("conversations");
  const [moreOpen, setMoreOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  // Close the "Other" menu on outside-click / Escape.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // Slide the underline under the active tab.
  useLayoutEffect(() => {
    const active = tablistRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    const ink = inkRef.current;
    if (!active || !ink) return;
    ink.style.width = `${active.offsetWidth}px`;
    ink.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [tab]);

  const autoGrow = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const send = () => {
    const el = inputRef.current;
    if (!el?.value.trim()) return;
    // Wire to your agent here. Demo: clear the field.
    el.value = "";
    autoGrow();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % TABS.length,
      ArrowLeft: (i - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = map[e.key];
    setTab(TABS[next].id);
    tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const rows = LIBRARY[tab];

  return (
    <div
      className="relative flex min-h-screen w-full overflow-hidden font-sans text-slate-100 antialiased"
      style={{
        background:
          "radial-gradient(130% 90% at 50% -12%, rgba(23,72,132,.55) 0%, rgba(23,72,132,0) 55%), radial-gradient(90% 70% at 88% 116%, rgba(11,74,128,.45) 0%, rgba(11,74,128,0) 60%), linear-gradient(180deg,#070b16 0%,#0a1122 55%,#070a13 100%)",
      }}
    >
      {/* scoped keyframes for the ambient motion */}
      <style>{`
        @keyframes opAurora { 0%,100%{transform:translate3d(0,0,0) scale(1);opacity:.85} 50%{transform:translate3d(0,14px,0) scale(1.06);opacity:1} }
        @keyframes opBloom  { 0%,100%{opacity:.5;transform:scale(.92)} 50%{opacity:1;transform:scale(1.12)} }
        @keyframes opRise   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @media (prefers-reduced-motion: reduce){ *{animation-duration:.01ms!important;animation-iteration-count:1!important} }
      `}</style>

      {/* ambient aurora + starfield (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(40% 32% at 50% 8%, rgba(63,143,224,.30), rgba(63,143,224,0) 70%), radial-gradient(34% 26% at 22% 30%, rgba(107,63,209,.16), rgba(107,63,209,0) 70%)",
          animation: "opAurora 14s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.10) .6px, transparent .6px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 65%)",
        }}
      />

      {/* sidebar (contextual chrome — the launchpad is the focus) */}
      <aside className="relative z-10 hidden w-[248px] shrink-0 flex-col border-r border-white/[.08] bg-[#0a1020]/80 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-2.5 px-4 pb-2 pt-4">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-800 shadow-inner">
            <Sparkles className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Agentic CRR</span>
        </div>

        <button
          type="button"
          className="mx-3 mb-2 mt-2.5 flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-[#2f7fd0] to-[#0b4a80] px-3.5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_rgba(22,99,179,.42)] ring-1 ring-inset ring-white/10 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Start report
          <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-80" aria-hidden />
        </button>

        <nav aria-label="Primary" className="flex flex-col gap-0.5 px-3 py-2">
          {NAV.map((n) => (
            <button
              key={n.label}
              type="button"
              aria-current={n.active ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
                n.active
                  ? "bg-sky-400/15 font-semibold text-white"
                  : "text-slate-300 hover:bg-white/[.06]",
              ].join(" ")}
            >
              <n.icon className={n.active ? "h-[18px] w-[18px] text-sky-300" : "h-[18px] w-[18px] text-slate-400"} aria-hidden />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/[.08] px-3 py-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] text-slate-300 transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
          >
            <Settings className="h-[18px] w-[18px] text-slate-400" aria-hidden />
            Settings
          </button>
        </div>
      </aside>

      {/* main / launchpad */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] px-4 pb-24 pt-12 sm:px-8 sm:pt-14">
          {/* hero */}
          <div className="flex flex-col items-center text-center">
            <div className="relative" style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) both" }}>
              <div className="grid h-[52px] w-[52px] place-items-center rounded-[15px] bg-gradient-to-br from-[#2b6fc0] to-[#0b4a80] shadow-[0_10px_40px_rgba(63,143,224,.55)] ring-1 ring-inset ring-white/10">
                <Sparkles className="h-6 w-6 text-white" aria-hidden />
              </div>
              <div
                aria-hidden
                className="absolute -inset-3.5 -z-10 rounded-[22px]"
                style={{
                  background: "radial-gradient(closest-side, rgba(63,143,224,.6), rgba(63,143,224,0))",
                  animation: "opBloom 3.4s ease-in-out infinite",
                }}
              />
            </div>

            <h1
              className="mt-5 text-[clamp(23px,2vw+16px,32px)] font-bold tracking-tight text-slate-50 [text-shadow:0_1px_30px_rgba(63,143,224,.25)]"
              style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .04s both" }}
            >
              {greeting()}, Julie
            </h1>
            <p
              className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-300/90"
              style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .08s both" }}
            >
              What would you like to file today? Describe it, or pick a report type — the
              Operator&apos;s agents take it from there.
            </p>

            {/* quick starts */}
            <div
              className="mt-7 flex w-full flex-col items-stretch justify-center gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
              style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .12s both" }}
            >
              {QUICK_STARTS.map((q) => (
                <button
                  key={q.code}
                  type="button"
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
                    q.primary
                      ? "bg-gradient-to-br from-[#2f7fd0] to-[#0b4a80] text-white shadow-[0_8px_30px_rgba(22,99,179,.5)] ring-1 ring-inset ring-white/10 hover:brightness-110"
                      : "border border-white/10 bg-white/[.055] text-slate-100 backdrop-blur hover:bg-white/[.11]",
                  ].join(" ")}
                >
                  <Sparkles className="h-[15px] w-[15px] opacity-90" aria-hidden />
                  Start {q.code}
                </button>
              ))}

              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[.04] px-4 py-2.5 text-[13.5px] font-semibold text-slate-300 backdrop-blur transition hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 sm:w-auto"
                >
                  Other
                  <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {moreOpen && (
                  <div
                    role="menu"
                    aria-label="Other report types"
                    className="absolute left-1/2 top-[calc(100%+8px)] z-20 min-w-[248px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0e1626] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.55)]"
                  >
                    {MORE_TYPES.map((m) => (
                      <button
                        key={m.code}
                        type="button"
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                      >
                        <span className="rounded-md bg-violet-500/80 px-1.5 py-0.5 text-[11px] font-bold text-white">{m.code}</span>
                        <span className="text-[12.5px] text-slate-300">{m.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* composer — the hero */}
            <div className="mt-8 w-full" style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .16s both" }}>
              <div className="group flex min-h-[150px] flex-col gap-2 rounded-[24px] border border-white/[.14] bg-white/[.045] p-4 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-xl transition focus-within:border-sky-400/60 focus-within:shadow-[0_0_0_1px_rgba(63,143,224,.5),0_0_44px_rgba(63,143,224,.28),0_28px_80px_rgba(11,74,128,.5)]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  onInput={autoGrow}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  aria-label="Ask the Operator or describe a report to start"
                  placeholder={"Ask the Operator, or say “Start a BE-11 for fiscal year 2025”…"}
                  className="min-h-[92px] w-full flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-slate-50 outline-none placeholder:text-slate-400/70"
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    aria-label="Attach source data"
                    className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/[.14] bg-white/5 text-slate-300 transition hover:border-sky-400/60 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                  >
                    <Plus className="h-[18px] w-[18px]" aria-hidden />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Voice input"
                      className="grid h-9 w-9 place-items-center rounded-[10px] text-slate-400 transition hover:bg-white/[.08] hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                    >
                      <Mic className="h-[18px] w-[18px]" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={send}
                      aria-label="Send to the Operator"
                      className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[#2f7fd0] to-[#0e5590] text-white shadow-[0_6px_20px_rgba(22,99,179,.5)] transition hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                    >
                      <ArrowUp className="h-[18px] w-[18px]" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* prompt suggestions */}
            <div
              className="mt-3.5 flex flex-wrap justify-center gap-2"
              style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .2s both" }}
            >
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.04] py-1.5 pl-2.5 pr-3 text-[12.5px] text-slate-300 transition hover:border-sky-400/50 hover:bg-sky-400/[.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                >
                  <Sparkles className="h-[13px] w-[13px] opacity-70" aria-hidden />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* library */}
          <section
            aria-label="Your library"
            className="mx-auto mt-11 w-full"
            style={{ animation: "opRise .5s cubic-bezier(.16,1,.3,1) .26s both" }}
          >
            <div
              role="tablist"
              aria-label="Library"
              ref={tablistRef}
              className="relative flex gap-0.5 border-b border-white/10"
            >
              {TABS.map((t, i) => {
                const selected = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls="lib-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={[
                      "relative px-3.5 py-2.5 text-[13.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
                      selected ? "text-white" : "text-slate-400 hover:text-slate-200",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
              <span
                ref={inkRef}
                aria-hidden
                className="absolute -bottom-px left-0 h-0.5 rounded bg-gradient-to-r from-[#3f8fe0] to-[#1663b3] shadow-[0_0_12px_rgba(63,143,224,.65)] transition-[transform,width] duration-200 ease-out"
              />
            </div>

            <div
              id="lib-panel"
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
              className="flex flex-col gap-0.5 py-1.5 focus-visible:outline-none"
            >
              {rows.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                >
                  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg bg-sky-400/[.16] text-sky-300">
                    <r.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-50">
                      <span className="truncate">{r.title}</span>
                      {r.badge && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE_TONE[r.badge.tone]}`}>
                          {r.badge.label}
                        </span>
                      )}
                    </span>
                    <span className="truncate text-[12px] text-slate-400">{r.sub}</span>
                  </span>
                  <span className="shrink-0 text-[11.5px] text-slate-400">{r.time}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
