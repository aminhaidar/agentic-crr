import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { OpHomeData, OpLibAction, OpLibRow } from "@/types/window";

/* Inline icons (kept dependency-free; matches the prototype's SVG set). */
const Spark = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className} aria-hidden>
    <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" strokeLinejoin="round" />
  </svg>
);
const ChevronDown = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const ChevronRight = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/** Inline SVG string from the engine (library-row icons), rendered decoratively. */
function Glyph({ html, className }: { html: string; className?: string }) {
  return <span className={className} aria-hidden dangerouslySetInnerHTML={{ __html: html }} />;
}

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

const LIB_TABS = [
  { id: "conversations", label: "Conversations" },
  { id: "artifacts", label: "Artifacts" },
  { id: "schedules", label: "Schedules" },
] as const;
type LibTabId = (typeof LIB_TABS)[number]["id"];

/** "View all" jumps to the matching full view. */
const VIEW_ALL: Record<LibTabId, string> = {
  conversations: "filings",
  artifacts: "artifacts",
  schedules: "schedules",
};

/** Engine pill class → v0 badge tone. */
const TONE: Record<string, string> = {
  blue: "bg-oh-review/15 text-oh-review-fg ring-1 ring-inset ring-oh-review/25",
  amber: "bg-oh-waiting/15 text-oh-waiting-fg ring-1 ring-inset ring-oh-waiting/25",
  green: "bg-oh-active/15 text-oh-active-fg ring-1 ring-inset ring-oh-active/25",
  grey: "bg-oh-surface-raised text-oh-filed-fg ring-1 ring-inset ring-oh-hairline",
};
const toneClass = (cls: string) => TONE[cls] ?? TONE.grey;

/**
 * Operator home — the v0 (Workiva Unify-derived) design, wired to the engine.
 * The engine stays the source of truth for fixtures + actions (via window);
 * this component owns semantic, accessible, responsive markup. All colors come
 * from the `.ophome`-scoped token layer (src/styles/operator-home.css).
 */
export function OperatorHome() {
  const [data, setData] = useState<OpHomeData | null>(null);
  const [tab, setTab] = useState<LibTabId>("conversations");
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasText, setHasText] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const refresh = () => window.opHomeData && setData(window.opHomeData());
    refresh();
    window.addEventListener("op:home", refresh);
    return () => window.removeEventListener("op:home", refresh);
  }, []);

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
  }, [tab, data]);

  const autoGrow = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    setHasText(el.value.trim().length > 0);
  }, []);

  const send = useCallback(() => {
    const el = inputRef.current;
    const txt = el?.value.trim();
    if (!txt) return;
    el!.value = "";
    autoGrow();
    const type = window.detectReportType(txt);
    if (type) window.operatorLaunch(txt, type);
    else window.goToNewSessionWithMessage(txt, "generic");
  }, [autoGrow]);

  const runAct = (a: OpLibAction) => {
    if (a.fn === "session") window.openSessionById(String(a.arg));
    else if (a.fn === "artifact") window.openArtifact(String(a.arg), a.arg2);
    else window.openScheduleModal(Number(a.arg));
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % LIB_TABS.length,
      ArrowLeft: (i - 1 + LIB_TABS.length) % LIB_TABS.length,
      Home: 0,
      End: LIB_TABS.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = map[e.key];
    setTab(LIB_TABS[next].id);
    tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  if (!data) return <div className="ophome min-h-full" />;

  const rows: OpLibRow[] = data.lib[tab];

  return (
    <div className="ophome relative z-10 text-oh-fg">
      <div className="mx-auto w-full max-w-[820px] px-4 pb-24 pt-14 sm:px-8 md:pt-16">
        {/* hero */}
        <div className="flex flex-col items-center text-center">
          <div className="op-rise relative">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-oh-brand-strong to-oh-brand-deep shadow-[0_16px_44px_-10px_rgba(0,117,219,0.55)] ring-1 ring-inset ring-white/10">
              <Spark className="size-6 text-oh-brand-fg" />
            </div>
            <div
              aria-hidden
              className="op-bloom absolute -inset-4 -z-10 rounded-[26px]"
              style={{ background: "radial-gradient(closest-side, rgba(0,117,219,0.55), transparent)" }}
            />
          </div>

          <h1 className="op-rise mt-6 text-balance text-[clamp(24px,2vw+16px,34px)] font-bold tracking-tight [animation-delay:40ms] [text-shadow:0_1px_30px_rgba(0,117,219,0.25)]">
            {greeting()}, Julie
          </h1>
          <p className="op-rise mt-2.5 max-w-xl text-pretty text-[15px] leading-relaxed text-oh-fg-muted [animation-delay:80ms]">
            What would you like to file? Describe it, or pick a report type — the agents take it from there.
          </p>

          {/* quick starts */}
          <div className="op-rise mt-7 flex w-full flex-col items-stretch justify-center gap-2.5 [animation-delay:120ms] sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            {data.quick.map((q) => (
              <button
                key={q.key}
                type="button"
                onClick={() => window.openReport(q.key)}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring",
                  q.primary
                    ? "bg-gradient-to-br from-oh-brand-strong to-oh-brand-deep text-oh-brand-fg shadow-[0_10px_30px_-8px_rgba(0,117,219,0.7)] ring-1 ring-inset ring-white/10 hover:brightness-110"
                    : "border border-white/10 bg-oh-surface text-oh-fg backdrop-blur hover:border-oh-brand/40 hover:bg-oh-surface-raised",
                ].join(" ")}
              >
                <Spark className="size-[15px] opacity-90" />
                Start {q.code}
              </button>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-oh-surface px-4 py-2.5 text-[13.5px] font-semibold text-oh-fg-muted backdrop-blur transition hover:bg-oh-surface-raised hover:text-oh-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring sm:w-auto"
              >
                Other
                <ChevronDown className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  aria-label="Other report types"
                  className="absolute left-1/2 top-[calc(100%+8px)] z-20 min-w-[264px] -translate-x-1/2 rounded-2xl border border-oh-hairline bg-oh-popover p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]"
                >
                  {data.more.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMoreOpen(false);
                        window.pickOther(m.key);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-oh-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
                    >
                      <span className="rounded-md bg-oh-brand/20 px-1.5 py-0.5 font-mono text-[11px] font-bold text-oh-brand-fg ring-1 ring-inset ring-oh-brand/30">
                        {m.code}
                      </span>
                      <span className="text-[12.5px] text-oh-fg-muted">{m.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* composer */}
          <div className="op-rise mt-8 w-full [animation-delay:160ms]">
            <div
              id="opComposer"
              className="group flex min-h-[156px] flex-col gap-2 rounded-2xl border border-white/[0.12] bg-oh-surface p-4 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-shadow duration-200 focus-within:border-oh-brand/60 focus-within:shadow-[0_0_0_1px_rgba(0,117,219,0.45),0_24px_70px_-24px_rgba(0,0,0,0.7)]"
            >
              <label htmlFor="opInput" className="sr-only">
                Ask the Operator or describe a report to start
              </label>
              <textarea
                id="opInput"
                ref={inputRef}
                rows={1}
                onInput={autoGrow}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={'Ask the Operator, or say "Start a BE-11 for fiscal year 2025"…'}
                className="min-h-[92px] w-full flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-oh-fg outline-none placeholder:text-oh-fg-muted"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Attach source data"
                  onClick={() => window.showToast("Attach source data (demo)")}
                  className="grid size-9 place-items-center rounded-xl border border-white/[0.14] bg-oh-surface text-oh-fg-muted transition hover:border-oh-brand/60 hover:text-oh-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="size-[18px]" aria-hidden>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="mr-1 hidden text-[11.5px] text-oh-fg-muted sm:inline">
                    <kbd className="rounded border border-oh-hairline bg-oh-surface px-1.5 py-0.5 font-sans text-[10.5px]">Enter</kbd> to send
                  </span>
                  <button
                    type="button"
                    aria-label="Voice input"
                    onClick={() => window.showToast("Voice input (demo)")}
                    className="grid size-9 place-items-center rounded-xl text-oh-fg-muted transition hover:bg-oh-surface-raised hover:text-oh-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-[18px]" aria-hidden>
                      <rect x="9" y="3" width="6" height="11" rx="3" />
                      <path d="M6 11a6 6 0 0012 0M12 17v4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    id="opSend"
                    onClick={send}
                    disabled={!hasText}
                    aria-label="Send to the Operator"
                    className="grid size-9 place-items-center rounded-lg bg-oh-brand text-oh-brand-fg transition hover:bg-oh-brand-strong active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring disabled:cursor-not-allowed disabled:bg-oh-surface-raised disabled:text-oh-fg-muted"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden>
                      <path d="M7 11l5-5 5 5" />
                      <path d="M12 6v13" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* prompt suggestions */}
          <div className="op-rise mt-4 flex flex-wrap justify-center gap-2 [animation-delay:200ms]">
            {data.prompts.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => window.opStarter(p.key)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-oh-surface py-1.5 pl-2.5 pr-3 text-[12.5px] text-oh-fg-muted transition hover:border-oh-brand/50 hover:bg-oh-brand/[0.12] hover:text-oh-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
              >
                <Spark className="size-[13px] opacity-70" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* library */}
        <section aria-label="Your library" className="op-rise mx-auto mt-12 w-full [animation-delay:260ms]">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-oh-fg-muted">Library</h2>
            <button
              type="button"
              onClick={() => window.go(VIEW_ALL[tab])}
              className="rounded text-[12.5px] font-medium text-oh-fg-muted transition hover:text-oh-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
            >
              View all
            </button>
          </div>

          <div role="tablist" aria-label="Library" ref={tablistRef} className="relative flex gap-0.5 border-b border-oh-hairline">
            {LIB_TABS.map((t, i) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`opLibTab-${t.id}`}
                  aria-selected={selected}
                  aria-controls="opLibPanel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={[
                    "relative rounded-t-md px-3.5 py-2.5 text-[13.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring",
                    selected ? "text-oh-fg" : "text-oh-fg-muted hover:text-oh-fg",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
            <span
              ref={inkRef}
              aria-hidden
              className="absolute -bottom-px left-0 h-0.5 rounded bg-gradient-to-r from-oh-brand to-oh-brand-deep shadow-[0_0_12px_rgba(63,143,224,0.65)] transition-[transform,width] duration-200 ease-out"
            />
          </div>

          <div id="opLibPanel" role="tabpanel" aria-labelledby={`opLibTab-${tab}`} tabIndex={0} className="flex flex-col gap-0.5 py-1.5 focus-visible:outline-none">
            {rows.length === 0 ? (
              <div className="px-3 py-5 text-center text-[13px] text-oh-fg-muted">Nothing here yet.</div>
            ) : (
              rows.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => runAct(r.act)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-oh-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-ring"
                >
                  <Glyph
                    html={r.icon}
                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-oh-brand/15 text-oh-brand ring-1 ring-inset ring-oh-brand/20 [&>svg]:size-4"
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 text-[13.5px] font-semibold text-oh-fg">
                      <span className="truncate">{r.title}</span>
                      {r.badge && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClass(r.badge.cls)}`}>
                          {r.badge.label}
                        </span>
                      )}
                    </span>
                    <span className="truncate text-[12px] text-oh-fg-muted">{r.sub}</span>
                  </span>
                  <span className="shrink-0 text-[11.5px] tabular-nums text-oh-fg-muted">{r.time}</span>
                  <ChevronRight className="size-4 shrink-0 text-transparent transition group-hover:text-oh-fg-muted" />
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
