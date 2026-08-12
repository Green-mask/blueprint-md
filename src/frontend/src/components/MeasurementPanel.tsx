import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GeoPosition, Waypoint } from "@/types";
import {
  calculateArea,
  calculatePerimeter,
  formatDistance,
  metersToFeet,
  sqmToAcres,
  sqmToHectares,
} from "@/utils/geo";
import { motion } from "motion/react";
import { useState } from "react";

type AreaUnit = "sqm" | "ha" | "acres";
type DistUnit = "m" | "ft";

interface MeasurementPanelProps {
  waypoints: Waypoint[];
  isClosed: boolean;
  gpsPosition: GeoPosition | null;
  gpsAccuracy: number | null;
  satelliteCount: number | null;
  gpsError: string | null;
  isTracking: boolean;
  captureMode: "tap" | "walk";
  onCaptureMode: (mode: "tap" | "walk") => void;
  onUndo: () => void;
  onClear: () => void;
  onClosePlot: () => void;
  onSave: () => void;
  onStartTracking: () => void;
}

function GpsBadge({
  position,
  error,
  isTracking,
  satelliteCount,
}: {
  position: GeoPosition | null;
  error: string | null;
  isTracking: boolean;
  satelliteCount: number | null;
}) {
  if (error) {
    return (
      <Badge
        variant="destructive"
        className="text-xs font-mono gap-1"
        data-ocid="measure.gps_denied_badge"
      >
        <span className="w-2 h-2 rounded-full bg-destructive-foreground inline-block" />
        GPS Denied
      </Badge>
    );
  }
  if (!isTracking || !position) {
    return (
      <Badge
        variant="outline"
        className="text-xs font-mono gap-1 border-muted-foreground text-muted-foreground"
        data-ocid="measure.gps_acquiring_badge"
      >
        <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block animate-pulse" />
        Acquiring GPS…
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs font-mono gap-1 border-primary text-primary"
      data-ocid="measure.gps_locked_badge"
    >
      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
      GPS ±{position.accuracy.toFixed(0)}m
      {satelliteCount !== null && (
        <span className="text-muted-foreground"> · {satelliteCount} sat</span>
      )}
    </Badge>
  );
}

export function MeasurementPanel({
  waypoints,
  isClosed,
  gpsPosition,
  gpsAccuracy,
  satelliteCount,
  gpsError,
  isTracking,
  captureMode,
  onCaptureMode,
  onUndo,
  onClear,
  onClosePlot,
  onSave,
  onStartTracking,
}: MeasurementPanelProps) {
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("sqm");
  const [distUnit, setDistUnit] = useState<DistUnit>("m");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const areaSqm =
    isClosed && waypoints.length >= 3 ? calculateArea(waypoints) : 0;
  const perimM =
    waypoints.length >= 2 ? calculatePerimeter(waypoints, isClosed) : 0;

  const displayArea = () => {
    if (areaUnit === "ha") return `${sqmToHectares(areaSqm).toFixed(4)} ha`;
    if (areaUnit === "acres") return `${sqmToAcres(areaSqm).toFixed(4)} ac`;
    return `${areaSqm.toFixed(2)} m²`;
  };

  const displayPerim = () => {
    if (distUnit === "ft") return `${metersToFeet(perimM).toFixed(1)} ft`;
    return formatDistance(perimM);
  };

  const canClose = !isClosed && waypoints.length >= 3;
  const canSave = isClosed && waypoints.length >= 3;
  const hasWaypoints = waypoints.length > 0;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-4 sm:right-4 z-[1000] sm:rounded-xl"
      data-ocid="measure.panel"
    >
      {/* Mobile bottom nav clearance */}
      <div className="sm:hidden h-16" aria-hidden="true" />

      <div
        className="bg-card border border-border sm:rounded-xl overflow-hidden"
        style={{
          boxShadow:
            "0 -2px 24px oklch(0.12 0 0 / 0.7), 0 0 0 1px oklch(0.62 0.18 233 / 0.15)",
        }}
      >
        {/* GPS status row */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <GpsBadge
            position={gpsPosition}
            error={gpsError}
            isTracking={isTracking}
            satelliteCount={satelliteCount}
          />

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => onCaptureMode("tap")}
              data-ocid="measure.tap_mode_toggle"
              className={`px-3 py-1 text-xs font-mono rounded transition-smooth ${
                captureMode === "tap"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TAP
            </button>
            <button
              type="button"
              onClick={() => onCaptureMode("walk")}
              data-ocid="measure.walk_mode_toggle"
              className={`px-3 py-1 text-xs font-mono rounded transition-smooth ${
                captureMode === "walk"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              WALK
            </button>
          </div>
        </div>

        {/* Main measurements */}
        <div className="grid grid-cols-2 divide-x divide-border px-0 py-3">
          {/* Area */}
          <div className="px-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">
                Area
              </span>
              <div className="flex gap-0.5">
                {(["sqm", "ha", "acres"] as AreaUnit[]).map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setAreaUnit(u)}
                    data-ocid={`measure.area_unit_${u}`}
                    className={`text-[9px] font-mono px-1 rounded transition-smooth ${
                      areaUnit === u
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {u === "sqm" ? "m²" : u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="font-mono text-2xl font-bold tabular-nums text-foreground leading-none"
              data-ocid="measure.area_value"
            >
              {isClosed && waypoints.length >= 3 ? displayArea() : "—"}
            </div>
          </div>

          {/* Perimeter */}
          <div className="px-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">
                Perimeter
              </span>
              <div className="flex gap-0.5">
                {(["m", "ft"] as DistUnit[]).map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setDistUnit(u)}
                    data-ocid={`measure.dist_unit_${u}`}
                    className={`text-[9px] font-mono px-1 rounded transition-smooth ${
                      distUnit === u
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="font-mono text-2xl font-bold tabular-nums text-foreground leading-none"
              data-ocid="measure.perimeter_value"
            >
              {waypoints.length >= 2 ? displayPerim() : "—"}
            </div>
          </div>
        </div>

        {/* Waypoint count */}
        <div
          className="px-4 pb-2 text-xs font-mono text-muted-foreground"
          data-ocid="measure.waypoint_count"
        >
          {waypoints.length} waypoint{waypoints.length !== 1 ? "s" : ""}
          {isClosed && " · polygon closed"}
          {gpsAccuracy !== null && !isClosed && isTracking && (
            <span className="ml-2 text-primary">· GPS ready</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-4 pb-4">
          {!isTracking && !gpsError && (
            <Button
              size="sm"
              className="flex-1"
              onClick={onStartTracking}
              data-ocid="measure.start_gps_button"
            >
              Start GPS
            </Button>
          )}

          {hasWaypoints && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={waypoints.length === 0}
                data-ocid="measure.undo_button"
                className="font-mono text-xs"
              >
                Undo
              </Button>

              {showClearConfirm ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onClear();
                      setShowClearConfirm(false);
                    }}
                    data-ocid="measure.clear_confirm_button"
                    className="font-mono text-xs"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowClearConfirm(false)}
                    data-ocid="measure.clear_cancel_button"
                    className="font-mono text-xs"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                  data-ocid="measure.clear_button"
                  className="font-mono text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  Clear
                </Button>
              )}

              {canClose && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClosePlot}
                  data-ocid="measure.close_plot_button"
                  className="font-mono text-xs border-primary/40 text-primary hover:bg-primary/10"
                >
                  Close Plot
                </Button>
              )}

              {canSave && (
                <Button
                  size="sm"
                  className="flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onSave}
                  data-ocid="measure.save_plot_button"
                >
                  Save Plot
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
