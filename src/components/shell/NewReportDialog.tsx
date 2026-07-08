import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ReportType } from "@/types/window";

/**
 * The "New report" modal, rebuilt as a real shadcn Dialog but wearing the
 * prototype's exact `.modal` / `.field` / `.btn` classes so it looks identical
 * to the source. Inputs keep the same ids the ported engine's `createReport()`
 * reads, so submission flows through the existing (proven) logic unchanged.
 */
export function NewReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const types: ReportType[] = window.__OP_DATA?.REPORT_TYPES ?? [];
  const [typeIdx, setTypeIdx] = useState(0);
  const t = types[typeIdx];

  const note = useMemo(() => {
    if (!t) return null;
    return (
      <>
        <strong>{t.code}</strong> — {t.name}. {t.formNote} Once you confirm scope, the Operator
        generates one <strong>{t.formCode}</strong> form per {t.unit} and carries each through the
        lifecycle.
      </>
    );
  }, [t]);

  function submit() {
    window.createReport();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <div className="modal-h">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
            <path d="M9 13h6M9 17h6" />
          </svg>
          <DialogTitle asChild>
            <h3>New report</h3>
          </DialogTitle>
          <button className="xbtn" onClick={() => onOpenChange(false)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-b">
          <div className="field">
            <label className="field-lab" htmlFor="nrName">
              Report name
            </label>
            <input id="nrName" placeholder="e.g. BE-11 · FY25" />
            <div className="field-hint">Shown as the report title across the workspace.</div>
          </div>
          <div className="field">
            <label className="field-lab" htmlFor="nrType">
              Report type
            </label>
            <select
              id="nrType"
              value={typeIdx}
              onChange={(e) => setTypeIdx(Number(e.currentTarget.value))}
            >
              {types.map((rt, i) => (
                <option key={rt.code} value={i}>
                  {rt.code} · {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="nr-daterow" style={{ display: "flex", gap: 14 }}>
            <div className="field" style={{ flex: 1, margin: 0 }}>
              <label className="field-lab" htmlFor="nrStart">
                Start date
              </label>
              <input id="nrStart" type="date" />
            </div>
            <div className="field" style={{ flex: 1, margin: 0 }}>
              <label className="field-lab" htmlFor="nrDue">
                Due date
              </label>
              <input id="nrDue" type="date" />
            </div>
          </div>
          <div className="field">
            <label className="field-lab" htmlFor="nrDataDue">
              Data collection due date
            </label>
            <input id="nrDataDue" type="date" />
          </div>
          <div className="field">
            <div className="field-note" id="nrNote">
              {note}
            </div>
          </div>
        </div>
        <div className="modal-f">
          <button className="btn sec" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button className="btn primary" onClick={submit}>
            Create report
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
