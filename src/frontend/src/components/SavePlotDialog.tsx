import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Waypoint } from "@/types";
import {
  calculateArea,
  calculatePerimeter,
  formatDistance,
  sqmToHectares,
} from "@/utils/geo";
import { useState } from "react";

interface SavePlotDialogProps {
  open: boolean;
  waypoints: Waypoint[];
  onSave: (name: string, notes: string) => Promise<void>;
  onClose: () => void;
}

export function SavePlotDialog({
  open,
  waypoints,
  onSave,
  onClose,
}: SavePlotDialogProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const areaSqm = calculateArea(waypoints);
  const perimM = calculatePerimeter(waypoints, true);

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Plot name is required");
      return;
    }
    setNameError("");
    setIsSaving(true);
    try {
      await onSave(name.trim(), notes.trim());
      setName("");
      setNotes("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setName("");
      setNotes("");
      setNameError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-md bg-card border-border"
        data-ocid="measure.save_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-foreground">
            Save Plot
          </DialogTitle>
        </DialogHeader>

        {/* Measurement summary */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
          <div>
            <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">
              Area
            </p>
            <p
              className="font-mono text-xl font-bold tabular-nums text-primary"
              data-ocid="measure.save_dialog_area"
            >
              {areaSqm.toFixed(2)} m²
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {sqmToHectares(areaSqm).toFixed(4)} ha
            </p>
          </div>
          <div>
            <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">
              Perimeter
            </p>
            <p
              className="font-mono text-xl font-bold tabular-nums text-foreground"
              data-ocid="measure.save_dialog_perimeter"
            >
              {formatDistance(perimM)}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {waypoints.length} waypoints
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="plot-name"
              className="font-display text-sm text-foreground"
            >
              Plot Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="plot-name"
              placeholder="e.g. Lot A – North Boundary"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              className="font-mono bg-muted/30 border-input focus-visible:ring-primary"
              data-ocid="measure.save_dialog_name_input"
              autoFocus
            />
            {nameError && (
              <p
                className="text-xs text-destructive font-mono"
                data-ocid="measure.save_dialog_name_error"
              >
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="plot-notes"
              className="font-display text-sm text-foreground"
            >
              Notes{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="plot-notes"
              placeholder="Site conditions, reference points, remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="font-mono text-sm bg-muted/30 border-input focus-visible:ring-primary resize-none"
              data-ocid="measure.save_dialog_notes_input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            data-ocid="measure.save_dialog_cancel_button"
            className="font-mono"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="measure.save_dialog_confirm_button"
            className="font-mono"
          >
            {isSaving ? (
              <span
                className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin"
                data-ocid="measure.save_dialog.loading_state"
              />
            ) : (
              "Save Plot"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
