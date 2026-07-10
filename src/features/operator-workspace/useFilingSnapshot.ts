import { useEffect, useState } from "react";
import type { FilingSnapshot } from "@/domain/filing";

/**
 * Subscribes to the engine's live filing snapshot. The engine calls
 * `window.__opFilingChanged` after every RPT render, so the Operator surface
 * re-renders in lockstep with the real filing it is driving.
 */
export function useFilingSnapshot(): FilingSnapshot | null {
  const [snapshot, setSnapshot] = useState<FilingSnapshot | null>(
    () => window.__opFilingSnapshot?.() ?? null,
  );

  useEffect(() => {
    // The component mounts once at app start (RPT is still null then), so
    // registering here reliably precedes the first __opEnterFiling call.
    window.__opFilingChanged = (next) => setSnapshot(next);
    return () => {
      delete window.__opFilingChanged;
    };
  }, []);

  return snapshot;
}
