import { useEffect, useState } from "react";
import { NewReportDialog } from "./NewReportDialog";

/**
 * React + shadcn chrome layered on top of the imperative shell. The engine owns
 * the shell DOM; here we take over discrete, self-contained interactions with
 * real shadcn components (styled to match the prototype exactly). Currently:
 * the "New report" modal is a shadcn Dialog.
 *
 * The window bridge is installed here; App.tsx re-points the engine's
 * `openNewReportModal` handler to it *after* initLegacy runs (parent effects
 * run after child effects), so inline onclick attributes open the React modal.
 */
export function ChromeEnhancements() {
  const [newReportOpen, setNewReportOpen] = useState(false);

  useEffect(() => {
    window.__openNewReport = () => setNewReportOpen(true);
    return () => {
      delete window.__openNewReport;
    };
  }, []);

  return <NewReportDialog open={newReportOpen} onOpenChange={setNewReportOpen} />;
}
