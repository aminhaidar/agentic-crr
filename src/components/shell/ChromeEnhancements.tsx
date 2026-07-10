import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ConversationalWorkspace } from "@/features/operator-workspace/ConversationalWorkspace";
import { OperatorSidebar } from "@/features/operator-nav/OperatorSidebar";
import { NewReportDialog } from "./NewReportDialog";
import { ThemeTransition } from "./ThemeTransition";

/**
 * React chrome layered on top of the imperative shell. The engine owns the shell
 * DOM; here we take over discrete pieces with real components — the "New report"
 * modal (shadcn Dialog) and the left navigation (Workiva Unify), which portals
 * into the shell's sidebar slot (#opNavMount) and drives the engine via go().
 *
 * The window bridge is installed here; App.tsx re-points the engine's
 * `openNewReportModal` handler to it *after* initLegacy runs (parent effects
 * run after child effects), so inline onclick attributes open the React modal.
 */
export function ChromeEnhancements() {
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [navMount, setNavMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    window.__openNewReport = () => setNewReportOpen(true);
    return () => {
      delete window.__openNewReport;
    };
  }, []);

  useEffect(() => {
    // The shell markup is already in the DOM (App renders it alongside this),
    // so the mount slot exists by the time this effect runs.
    const mount = document.getElementById("opNavMount");
    if (!mount) return;
    document.body.classList.add("op-nav-react");
    // The prototype nav stays in the DOM (so the engine's queries don't break)
    // but is replaced by the Unify nav — take it out of the a11y tree so it
    // isn't a duplicate for screen readers or tests.
    const superseded = Array.from(
      mount.parentElement?.querySelectorAll(":scope > :not(#opNavMount)") ?? [],
    ) as HTMLElement[];
    superseded.forEach((el) => {
      el.setAttribute("aria-hidden", "true");
      el.inert = true;
    });
    // Defer the state update out of the effect body (portal target is stable).
    queueMicrotask(() => setNavMount(mount));
    return () => {
      document.body.classList.remove("op-nav-react");
      superseded.forEach((el) => {
        el.removeAttribute("aria-hidden");
        el.inert = false;
      });
    };
  }, []);

  return (
    <>
      <ThemeTransition />
      <div className="conversation-workspace-host">
        <ConversationalWorkspace />
      </div>
      <NewReportDialog open={newReportOpen} onOpenChange={setNewReportOpen} />
      {navMount && createPortal(<OperatorSidebar />, navMount)}
    </>
  );
}
