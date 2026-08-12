import { MapView } from "@/components/MapView";
import { MeasurementPanel } from "@/components/MeasurementPanel";
import { SavePlotDialog } from "@/components/SavePlotDialog";
import { useCreatePlot, useSaveDraftPlot } from "@/hooks/useBackendPlots";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { Waypoint } from "@/types";
import { geoPositionToWaypoint, hasMoved } from "@/utils/geo";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Measure() {
  const geo = useGeolocation();
  const createPlot = useCreatePlot();
  const saveDraft = useSaveDraftPlot();

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [captureMode, setCaptureMode] = useState<"tap" | "walk">("tap");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const prevWalkPos = useRef(geo.position);
  const walkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autosaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Auto-start GPS tracking on mount to trigger browser permission prompt immediately
  const { startTracking } = geo;
  useEffect(() => {
    startTracking();
  }, [startTracking]);

  // WALK mode: auto-capture every 5 seconds when moved 3+ meters
  useEffect(() => {
    if (captureMode !== "walk" || !geo.isTracking || isClosed) return;

    walkIntervalRef.current = setInterval(() => {
      const curr = geo.position;
      if (!curr) return;
      if (hasMoved(prevWalkPos.current, curr, 3)) {
        const seq = waypoints.length;
        setWaypoints((prev) => [...prev, geoPositionToWaypoint(curr, seq)]);
        prevWalkPos.current = curr;
      }
    }, 5000);

    return () => {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    };
  }, [captureMode, geo.isTracking, geo.position, isClosed, waypoints.length]);

  // Autosave draft every 30 seconds when measurement is in progress
  useEffect(() => {
    if (waypoints.length < 2) return;

    autosaveIntervalRef.current = setInterval(async () => {
      if (waypoints.length < 2) return;
      try {
        await saveDraft.mutateAsync({
          name: `Draft – ${new Date().toLocaleTimeString()}`,
          notes: "",
          waypoints,
        });
      } catch {
        // Silent fail for autosave
      }
    }, 30000);

    return () => {
      if (autosaveIntervalRef.current)
        clearInterval(autosaveIntervalRef.current);
    };
  }, [waypoints, saveDraft]);

  const handleAddWaypoint = useCallback(
    (lat: number, lon: number) => {
      if (isClosed) return;
      const acc = geo.position?.accuracy ?? 5;
      const wp: Waypoint = {
        lat,
        lon,
        accuracy: acc,
        // Backend expects nanoseconds (Int); Date.now() returns ms → multiply by 1_000_000n
        timestamp: BigInt(Date.now()) * 1_000_000n,
        sequence: BigInt(waypoints.length),
      };
      setWaypoints((prev) => [...prev, wp]);
    },
    [isClosed, geo.position, waypoints.length],
  );

  const handleClosePlot = useCallback(() => {
    if (waypoints.length >= 3) {
      setIsClosed(true);
      toast.success("Polygon closed", {
        description: `${waypoints.length} waypoints captured`,
        duration: 3000,
      });
    }
  }, [waypoints.length]);

  const handleUndo = useCallback(() => {
    setWaypoints((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
    if (isClosed) setIsClosed(false);
  }, [isClosed]);

  const handleClear = useCallback(() => {
    setWaypoints([]);
    setIsClosed(false);
    prevWalkPos.current = null;
  }, []);

  const handleSave = async (name: string, notes: string) => {
    try {
      await createPlot.mutateAsync({ name, notes, waypoints });
      toast.success("Plot saved!", {
        description: `"${name}" has been saved to your plots`,
        duration: 4500,
      });
      setShowSaveDialog(false);
      handleClear();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Save failed", {
        description: `Could not save plot: ${msg}`,
        duration: 6000,
      });
    }
  };

  const handleCaptureMode = useCallback(
    (mode: "tap" | "walk") => {
      setCaptureMode(mode);
      if (mode === "walk") {
        prevWalkPos.current = geo.position;
        if (!geo.isTracking) geo.startTracking();
        toast.info("Walk mode active", {
          description:
            "Move 3+ meters — waypoint auto-captures every 5 seconds",
          duration: 4000,
        });
      }
    },
    [geo],
  );

  return (
    <div className="flex-1 flex flex-col relative" data-ocid="measure.page">
      {/* Full-bleed map */}
      <div className="absolute inset-0" style={{ bottom: 0 }}>
        <MapView
          position={geo.position}
          waypoints={waypoints}
          isClosed={isClosed}
          captureMode={captureMode}
          onAddWaypoint={handleAddWaypoint}
          onClosePlot={handleClosePlot}
        />
      </div>

      {/* Floating GPS coordinate display — top left on desktop, hidden on mobile */}
      {geo.position && (
        <div
          className="absolute top-3 left-3 z-[1000] hidden sm:block"
          data-ocid="measure.gps_coords"
        >
          <div
            className="bg-card/90 border border-border rounded-lg px-3 py-2 backdrop-blur-sm"
            style={{ boxShadow: "0 2px 8px oklch(0.1 0 0 / 0.5)" }}
          >
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Current Position
            </div>
            <div className="font-mono text-sm tabular-nums text-primary">
              {geo.position.lat.toFixed(7)}
            </div>
            <div className="font-mono text-sm tabular-nums text-primary">
              {geo.position.lon.toFixed(7)}
            </div>
            {geo.position.altitude !== null && (
              <div className="font-mono text-xs text-muted-foreground">
                Alt: {geo.position.altitude?.toFixed(1)}m
              </div>
            )}
          </div>
        </div>
      )}

      {/* Measurement panel */}
      <MeasurementPanel
        waypoints={waypoints}
        isClosed={isClosed}
        gpsPosition={geo.position}
        gpsAccuracy={geo.position?.accuracy ?? null}
        satelliteCount={geo.satelliteCount}
        gpsError={geo.error}
        isTracking={geo.isTracking}
        captureMode={captureMode}
        onCaptureMode={handleCaptureMode}
        onUndo={handleUndo}
        onClear={handleClear}
        onClosePlot={handleClosePlot}
        onSave={() => setShowSaveDialog(true)}
        onStartTracking={geo.startTracking}
      />

      {/* Save dialog */}
      <SavePlotDialog
        open={showSaveDialog}
        waypoints={waypoints}
        onSave={handleSave}
        onClose={() => setShowSaveDialog(false)}
      />
    </div>
  );
}
