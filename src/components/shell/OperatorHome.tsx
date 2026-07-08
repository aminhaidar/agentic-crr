import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { OpHomeData, OpLibAction, OpLibRow } from "@/types/window";

/** Inline SVG string from the engine, rendered decoratively. */
function Glyph({ html, className }: { html: string; className?: string }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const LIB_TABS = [
  { id: "conversations", label: "Conversations" },
  { id: "artifacts", label: "Artifacts" },
  { id: "schedules", label: "Schedules" },
] as const;
type LibTabId = (typeof LIB_TABS)[number]["id"];

/**
 * Operator home — rebuilt as a real React view (was innerHTML in the engine).
 * The engine stays the source of truth for fixtures + actions (via window);
 * this component owns semantic, accessible, responsive markup and reuses the
 * prototype's `op-*` classes so the dark theme and layout are unchanged.
 */
export function OperatorHome() {
  const [data, setData] = useState<OpHomeData | null>(null);
  const [tab, setTab] = useState<LibTabId>("conversations");
  const [moreOpen, setMoreOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  // Pull fixtures on mount and whenever the engine re-enters home.
  useEffect(() => {
    const refresh = () => window.opHomeData && setData(window.opHomeData());
    refresh();
    window.addEventListener("op:home", refresh);
    return () => window.removeEventListener("op:home", refresh);
  }, []);

  // Close the "Other" menu on outside click / Escape.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // Slide the tab underline under the active tab.
  useLayoutEffect(() => {
    const list = tablistRef.current;
    const ink = inkRef.current;
    if (!list || !ink) return;
    const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!active) return;
    ink.style.width = `${active.offsetWidth}px`;
    ink.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [tab, data]);

  const autoGrow = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, []);

  const send = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const txt = el.value.trim();
    if (!txt) return;
    el.value = "";
    autoGrow();
    const type = window.detectReportType(txt);
    if (type) window.operatorLaunch(txt, type);
    else window.goToNewSessionWithMessage(txt, "generic");
  }, [autoGrow]);

  const onComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const runAct = (a: OpLibAction) => {
    if (a.fn === "session") window.openSessionById(String(a.arg));
    else if (a.fn === "artifact") window.openArtifact(String(a.arg), a.arg2);
    else window.openScheduleModal(Number(a.arg));
  };

  // Roving-tabindex + arrow-key navigation for the library tabs.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % LIB_TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + LIB_TABS.length) % LIB_TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = LIB_TABS.length - 1;
    else return;
    e.preventDefault();
    const id = LIB_TABS[next].id;
    setTab(id);
    tablistRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };

  if (!data) return <div className="op-stage" />;

  const rows: OpLibRow[] = data.lib[tab];

  return (
    <div className="op-stage">
      <div className="op-hero">
        <div className="op-hero-mark">
          <Glyph html={data.icons.spark} />
        </div>
        <h1 className="op-greet" id="opGreet">
          {greeting()}, Julie
        </h1>
        <p className="op-sub">
          What would you like to file today? Describe it, or pick a report type —
          the Operator's agents take it from there.
        </p>

        {/* Quick-start report types */}
        <div className="op-quick">
          {data.quick.map((q) => (
            <button
              key={q.key}
              type="button"
              className={`op-qbtn${q.primary ? " primary" : ""}`}
              onClick={() => window.openReport(q.key)}
            >
              <Glyph html={data.icons.spark} />
              Start {q.code}
            </button>
          ))}
          <div className={`op-qmore${moreOpen ? " open" : ""}`} ref={moreRef}>
            <button
              type="button"
              className="op-qbtn ghost"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              Other
              <Glyph className="op-qcar" html={data.icons.chev} />
            </button>
            <div className="op-qmore-menu" role="menu" aria-label="Other report types">
              {data.more.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="menuitem"
                  className="op-qmore-item"
                  onClick={() => {
                    setMoreOpen(false);
                    window.pickOther(m.key);
                  }}
                >
                  <span className="op-qmore-code">{m.code}</span>
                  <span className="op-qmore-sub">{m.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="op-composer" id="opComposer">
          <div className="op-composer-in">
            <textarea
              ref={inputRef}
              id="opInput"
              rows={1}
              aria-label="Ask the Operator or describe a report to start"
              placeholder={"Ask the Operator, or say “Start a BE-11 for fiscal year 2025”…"}
              onKeyDown={onComposerKey}
              onInput={autoGrow}
            />
            <div className="op-composer-bar">
              <button
                type="button"
                className="op-plus"
                aria-label="Attach source data"
                onClick={() => window.showToast("Attach source data (demo)")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <div className="op-composer-ctl">
                <button
                  type="button"
                  className="op-ctl-ghost"
                  aria-label="Voice input"
                  onClick={() => window.showToast("Voice input (demo)")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M6 11a6 6 0 0012 0M12 17v4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="op-send"
                  id="opSend"
                  aria-label="Send to the Operator"
                  onClick={send}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 11l5-5 5 5" />
                    <path d="M12 6v13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt suggestions */}
        <div className="op-prompts">
          {data.prompts.map((p) => (
            <button
              key={p.key}
              type="button"
              className="op-prompt"
              onClick={() => window.opStarter(p.key)}
            >
              <Glyph html={data.icons.op} />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      <section className="op-lib" aria-label="Your library">
        <div className="op-lib-tabs" role="tablist" aria-label="Library" ref={tablistRef}>
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
                className={`op-lib-tab${selected ? " active" : ""}`}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {t.label}
              </button>
            );
          })}
          <span className="op-lib-ink" ref={inkRef} />
        </div>
        <div
          className="op-lib-body enter"
          id="opLibPanel"
          role="tabpanel"
          aria-labelledby={`opLibTab-${tab}`}
          tabIndex={0}
        >
          {rows.length === 0 ? (
            <div className="op-lib-empty">Nothing here yet.</div>
          ) : (
            rows.map((r, i) => (
              <button
                key={i}
                type="button"
                className="op-row"
                onClick={() => runAct(r.act)}
              >
                <Glyph className="op-row-ic" html={r.icon} />
                <span className="op-row-main">
                  <span className="op-row-h">
                    {r.title}
                    {r.badge && (
                      <span className={`pill ${r.badge.cls}`} style={{ marginLeft: 8 }}>
                        {r.badge.label}
                      </span>
                    )}
                  </span>
                  <span className="op-row-m">{r.sub}</span>
                </span>
                <span className="op-row-time">{r.time}</span>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
