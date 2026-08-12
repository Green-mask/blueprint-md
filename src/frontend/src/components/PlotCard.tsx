import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Plot } from "@/types";
import { PlotStatus } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Activity, ChevronRight, MapPin, Pencil } from "lucide-react";

interface PlotCardProps {
  plot: Plot;
  index: number;
  onOpen: (plot: Plot) => void;
}

function formatArea(sqm: number) {
  const acres = sqm * 0.000247105;
  return {
    sqm: sqm < 1000 ? sqm.toFixed(1) : `${(sqm / 1000).toFixed(3)}k`,
    acres: acres.toFixed(4),
  };
}

function formatPerimeter(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(3)} km` : `${m.toFixed(1)} m`;
}

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PlotCard({ plot, index, onOpen }: PlotCardProps) {
  const navigate = useNavigate();
  const isDraft = plot.status === PlotStatus.draft;
  const area = formatArea(plot.areaSqm);

  function handleResumeDraft(e: React.MouseEvent) {
    e.stopPropagation();
    void navigate({ to: "/measure" });
  }

  return (
    <div
      data-ocid={`plots.item.${index}`}
      className={cn(
        "group relative bg-card border rounded-lg p-4 transition-smooth",
        isDraft ? "border-warning/30 bg-warning/5" : "border-border",
      )}
    >
      {/* Invisible full-card click target */}
      <button
        type="button"
        aria-label={`Open plot ${plot.name}`}
        onClick={() => onOpen(plot)}
        className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 group-hover:border-primary/40 cursor-pointer"
      />
      {/* Top row: name + status badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin
            className={cn(
              "w-4 h-4 shrink-0",
              isDraft ? "text-warning" : "text-primary",
            )}
          />
          <h3 className="font-display font-semibold text-foreground text-sm truncate">
            {plot.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isDraft ? (
            <Badge
              data-ocid={`plots.draft_badge.${index}`}
              className="bg-warning/20 text-warning border-warning/30 text-[10px] uppercase tracking-wide"
            >
              Draft
            </Badge>
          ) : (
            <Badge
              data-ocid={`plots.complete_badge.${index}`}
              className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wide"
            >
              Complete
            </Badge>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
            Area
          </p>
          <p className="font-mono text-sm font-bold text-foreground tabular-nums">
            {area.sqm} m²
          </p>
          <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {area.acres} ac
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
            Perimeter
          </p>
          <p className="font-mono text-sm font-bold text-foreground tabular-nums">
            {formatPerimeter(plot.perimeterM)}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
            Points
          </p>
          <p className="font-mono text-sm font-bold text-foreground tabular-nums flex items-center gap-1">
            <Activity className="w-3 h-3 text-primary" />
            {plot.waypoints.length}
          </p>
        </div>
      </div>

      {/* Footer: date + draft action */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-body">
        <span>Created {formatDate(plot.createdAt)}</span>
        {isDraft && (
          <button
            type="button"
            data-ocid={`plots.resume_draft.${index}`}
            onClick={handleResumeDraft}
            className="flex items-center gap-1 text-warning hover:text-warning-dim transition-smooth font-display font-medium"
          >
            <Pencil className="w-3 h-3" />
            Resume
          </button>
        )}
      </div>
    </div>
  );
}
