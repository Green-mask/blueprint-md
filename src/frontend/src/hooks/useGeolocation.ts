import type { GeoPosition } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GeolocationState {
  position: GeoPosition | null;
  isTracking: boolean;
  error: string | null;
  satelliteCount: number | null;
  startTracking: () => void;
  stopTracking: () => void;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 1000,
};

// Estimate satellite count from accuracy (heuristic for display purposes)
function estimateSatellites(accuracy: number): number {
  if (accuracy <= 3) return 18;
  if (accuracy <= 5) return 14;
  if (accuracy <= 10) return 10;
  if (accuracy <= 20) return 7;
  if (accuracy <= 50) return 5;
  return 4;
}

export function useGeolocation(): GeolocationState {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [satelliteCount, setSatelliteCount] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const geoPos: GeoPosition = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      altitude: pos.coords.altitude,
      speed: pos.coords.speed,
      timestamp: pos.timestamp,
    };
    setPosition(geoPos);
    setError(null);
    setSatelliteCount(estimateSatellites(pos.coords.accuracy));
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: "Location access denied. Please enable GPS permissions.",
      2: "Location unavailable. Check GPS signal.",
      3: "Location request timed out. Move to open sky.",
    };
    setError(messages[err.code] ?? "Unknown location error.");
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setError(null);
    setIsTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      GEO_OPTIONS,
    );
  }, [handleSuccess, handleError]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    position,
    isTracking,
    error,
    satelliteCount,
    startTracking,
    stopTracking,
  };
}
