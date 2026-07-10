import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateReportMutation,
  useReportTypesQuery,
} from "@/features/reports/reportQueries";

/**
 * The "New report" modal, rebuilt as a real shadcn Dialog but wearing the
 * prototype's exact `.modal` / `.field` / `.btn` classes so it looks identical
 * to the source. It submits typed values to the report-creation adapter; input
 * ids remain stable only for styling and legacy compatibility.
 */
export function NewReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const reportTypesQuery = useReportTypesQuery();
  const createReportMutation = useCreateReportMutation();
  const types = reportTypesQuery.data ?? [];
  const [typeIdx, setTypeIdx] = useState(0);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dataCollectionDueDate, setDataCollectionDueDate] = useState("");
  const t = types[typeIdx];

  function resetForm() {
    setTypeIdx(0);
    setName("");
    setStartDate("");
    setDueDate("");
    setDataCollectionDueDate("");
    createReportMutation.reset();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  const note = t ? (
    <>
      <strong>{t.code}</strong> — {t.name}. {t.formNote} Once you confirm scope,
      the Operator generates one <strong>{t.formCode}</strong> form per {t.unit}{" "}
      and carries each through the lifecycle.
    </>
  ) : null;

  async function submit() {
    if (!t || createReportMutation.isPending) return;

    try {
      const created = await createReportMutation.mutateAsync({
        name,
        reportTypeCode: t.code,
        startDate: startDate || null,
        dueDate: dueDate || null,
        dataCollectionDueDate: dataCollectionDueDate || null,
      });
      window.__onReportCreated?.(created);
      handleOpenChange(false);
    } catch {
      window.showToast("Unable to create the report. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const dialog = event.currentTarget as HTMLElement | null;
          dialog?.querySelector<HTMLInputElement>("#nrName")?.focus();
        }}
      >
        <div className="modal-h">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
            <path d="M9 13h6M9 17h6" />
          </svg>
          <DialogTitle asChild>
            <h3>New report</h3>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a regulatory report and set its collection timeline.
          </DialogDescription>
          <Button
            type="button"
            className="xbtn"
            onClick={() => handleOpenChange(false)}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>
        <div className="modal-b">
          <div className="field">
            <label className="field-lab" htmlFor="nrName">
              Report name
            </label>
            <input
              id="nrName"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="e.g. BE-11 · FY25"
            />
            <div className="field-hint">
              Shown as the report title across the workspace.
            </div>
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
          <div className="nr-daterow">
            <div className="field">
              <label className="field-lab" htmlFor="nrStart">
                Start date
              </label>
              <input
                id="nrStart"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.currentTarget.value)}
              />
            </div>
            <div className="field">
              <label className="field-lab" htmlFor="nrDue">
                Due date
              </label>
              <input
                id="nrDue"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.currentTarget.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-lab" htmlFor="nrDataDue">
              Data collection due date
            </label>
            <input
              id="nrDataDue"
              type="date"
              value={dataCollectionDueDate}
              onChange={(event) =>
                setDataCollectionDueDate(event.currentTarget.value)
              }
            />
          </div>
          <div className="field">
            <div className="field-note" id="nrNote">
              {note}
            </div>
          </div>
        </div>
        <div className="modal-f">
          <Button
            type="button"
            className="btn sec"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="btn primary"
            onClick={submit}
            disabled={!t || createReportMutation.isPending}
          >
            {createReportMutation.isPending ? "Creating…" : "Create report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
