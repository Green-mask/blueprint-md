import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeletePlot,
  useExportPlot,
  useUpdatePlot,
} from "@/hooks/useBackendPlots";
import { cn } from "@/lib/utils";
import type { Plot } from "@/types";
import { PlotStatus } from "@/types";
import { Download, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlotDetailDrawerProps {
  plot: Plot | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PlotDetailDrawer({
  plot,
  open,
  onClose,
}: PlotDetailDrawerProps) {
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const deletePlot = useDeletePlot();
  const exportPlot = useExportPlot();
  const updatePlot = useUpdatePlot();

  const isDraft = plot?.status === PlotStatus.draft;

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
      setIsEditing(false);
    }
  }

  function startEditing() {
    if (!plot) return;
    setEditName(plot.name);
    setEditNotes(plot.notes);
    setIsEditing(true);
  }

  async function handleSave() {
    if (!plot) return;
    try {
      await updatePlot.mutateAsync({
        plotId: plot.id,
        input: { name: editName, notes: editNotes, waypoints: plot.waypoints },
      });
      toast.success("Plot updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update plot");
    }
  }

  async function handleDelete() {
    if (!plot) return;
    try {
      await deletePlot.mutateAsync(plot.id);
      toast.success("Plot deleted");
      onClose();
    } catch {
      toast.error("Failed to delete plot");
    }
  }

  async function handleExport() {
    if (!plot) return;
    try {
      const data = await exportPlot.mutateAsync(plot.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${plot.name.replace(/\s+/g, "_")}_plot.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Plot exported");
    } catch {
      toast.error("Failed to export plot");
    }
  }

  if (!plot) return null;

  const acres = (plot.areaSqm * 0.000247105).toFixed(4);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        data-ocid="plots.detail_sheet"
        side="right"
        className="w-full sm:max-w-lg bg-card border-border flex flex-col gap-0 p-0 overflow-y-auto"
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="font-display text-foreground text-base truncate">
              {isEditing ? "Edit Plot" : plot.name}
            </SheetTitle>
            {isDraft ? (
              <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px] uppercase shrink-0">
                Draft
              </Badge>
            ) : (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase shrink-0">
                Complete
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Edit form */}
          {isEditing ? (
            <div className="px-5 py-4 space-y-4 border-b border-border">
              <div className="space-y-1.5">
                <Label className="text-xs font-display text-muted-foreground uppercase tracking-wide">
                  Name
                </Label>
                <Input
                  data-ocid="plots.edit_name_input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-muted/30 border-border font-body"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-display text-muted-foreground uppercase tracking-wide">
                  Notes
                </Label>
                <Textarea
                  data-ocid="plots.edit_notes_textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="bg-muted/30 border-border font-body resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  data-ocid="plots.save_button"
                  size="sm"
                  onClick={handleSave}
                  disabled={updatePlot.isPending}
                  className="flex-1"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {updatePlot.isPending ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                  data-ocid="plots.cancel_edit_button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Metadata panel */
            <div className="px-5 py-4 space-y-4 border-b border-border">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Area (m²)", value: plot.areaSqm.toFixed(2) },
                  { label: "Area (acres)", value: acres },
                  {
                    label: "Perimeter",
                    value:
                      plot.perimeterM >= 1000
                        ? `${(plot.perimeterM / 1000).toFixed(3)} km`
                        : `${plot.perimeterM.toFixed(2)} m`,
                  },
                  { label: "Waypoints", value: String(plot.waypoints.length) },
                  { label: "Created", value: formatDate(plot.createdAt) },
                  { label: "Updated", value: formatDate(plot.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
                      {label}
                    </p>
                    <p className="font-mono text-sm text-foreground tabular-nums break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {plot.notes && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
                    Notes
                  </p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {plot.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Waypoints table */}
          <div className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-3">
              Waypoints ({plot.waypoints.length})
            </p>
            <div className="border border-border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {["#", "Latitude", "Longitude", "Accuracy"].map((h) => (
                        <th
                          key={h}
                          className={cn(
                            "px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-display",
                            h === "#" ? "text-left w-8" : "text-right",
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plot.waypoints
                      .slice()
                      .sort((a, b) => Number(a.sequence) - Number(b.sequence))
                      .map((wp, i) => (
                        <tr
                          key={`wp-${Number(wp.sequence)}`}
                          data-ocid={`plots.waypoint.${i + 1}`}
                          className={cn(
                            "border-b border-border last:border-0 transition-smooth",
                            i % 2 === 0 ? "bg-muted/10" : "bg-transparent",
                          )}
                        >
                          <td className="px-2 py-2 text-muted-foreground">
                            {Number(wp.sequence)}
                          </td>
                          <td className="px-2 py-2 text-right text-foreground tabular-nums">
                            {wp.lat.toFixed(7)}
                          </td>
                          <td className="px-2 py-2 text-right text-foreground tabular-nums">
                            {wp.lon.toFixed(7)}
                          </td>
                          <td className="px-2 py-2 text-right text-primary tabular-nums">
                            ±{wp.accuracy.toFixed(1)} m
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-border bg-muted/10 flex items-center gap-2">
          {!isEditing && (
            <Button
              data-ocid="plots.edit_button"
              variant="outline"
              size="sm"
              onClick={startEditing}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          <Button
            data-ocid="plots.export_button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exportPlot.isPending}
            className={cn(!isEditing ? "flex-1" : "flex-[2]")}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {exportPlot.isPending ? "Exporting…" : "Export JSON"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid="plots.delete_button"
                variant="destructive"
                size="sm"
                aria-label="Delete plot"
                className="shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="plots.delete_dialog"
              className="bg-card border-border"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-foreground">
                  Delete Plot?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-body text-muted-foreground">
                  <strong className="text-foreground">"{plot.name}"</strong>{" "}
                  will be permanently deleted. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid="plots.delete_cancel_button"
                  className="font-display"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="plots.delete_confirm_button"
                  onClick={handleDelete}
                  disabled={deletePlot.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-display"
                >
                  {deletePlot.isPending ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
