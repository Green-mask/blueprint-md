import type { GeoPosition, Waypoint } from "@/types";

const EARTH_RADIUS_M = 6371000;

/** Convert degrees to radians */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance between two points in meters */
export function calculateDistance(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const haversine =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_RADIUS_M * c;
}

/**
 * Geodesic Shoelace formula to compute area of a closed polygon.
 * Returns area in square meters (m²).
 * Handles spherical coordinates via projected lat/lon differences.
 */
export function calculateArea(
  waypoints: Array<{ lat: number; lon: number }>,
): number {
  const n = waypoints.length;
  if (n < 3) return 0;

  // Spherical excess via the Gauss trapezoidal formula
  // This is accurate for typical land plot sizes (<50 km)
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = toRad(waypoints[i].lon);
    const xj = toRad(waypoints[j].lon);
    const yi = Math.log(Math.tan(Math.PI / 4 + toRad(waypoints[i].lat) / 2));
    const yj = Math.log(Math.tan(Math.PI / 4 + toRad(waypoints[j].lat) / 2));
    area += (xj - xi) * (yj + yi);
  }

  // Convert from spherical to m²  using the mean latitude for projection scaling
  const meanLat = waypoints.reduce((sum, wp) => sum + wp.lat, 0) / n;
  const cosLat = Math.cos(toRad(meanLat));
  const areaRad = Math.abs(area) / 2;

  // Project: R² * cos(lat) * delta_lon_rad * delta_lat_rad ≈ area_m²
  return areaRad * EARTH_RADIUS_M * EARTH_RADIUS_M * cosLat;
}

/** Calculate perimeter of a polygon (or open polyline) in meters */
export function calculatePerimeter(
  waypoints: Array<{ lat: number; lon: number }>,
  closed = true,
): number {
  const n = waypoints.length;
  if (n < 2) return 0;

  let total = 0;
  for (let i = 0; i < n - 1; i++) {
    total += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  if (closed && n >= 3) {
    total += calculateDistance(waypoints[n - 1], waypoints[0]);
  }
  return total;
}

/** Calculate centroid of a polygon */
export function calculateCentroid(
  waypoints: Array<{ lat: number; lon: number }>,
): { lat: number; lon: number } | null {
  const n = waypoints.length;
  if (n === 0) return null;
  const lat = waypoints.reduce((s, p) => s + p.lat, 0) / n;
  const lon = waypoints.reduce((s, p) => s + p.lon, 0) / n;
  return { lat, lon };
}

/** Midpoint between two coordinates */
export function midpoint(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): { lat: number; lon: number } {
  return { lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2 };
}

/** Convert m² to hectares */
export function sqmToHectares(sqm: number): number {
  return sqm / 10000;
}

/** Convert m² to acres */
export function sqmToAcres(sqm: number): number {
  return sqm / 4046.8564224;
}

/** Convert meters to feet */
export function metersToFeet(m: number): number {
  return m * 3.28084;
}

/** Check if two positions are farther apart than threshold meters */
export function hasMoved(
  a: GeoPosition | null,
  b: GeoPosition | null,
  thresholdM = 3,
): boolean {
  if (!a || !b) return false;
  return calculateDistance(a, b) >= thresholdM;
}

/** Format a distance nicely */
export function formatDistance(m: number): string {
  if (m < 1000) return `${m.toFixed(1)} m`;
  return `${(m / 1000).toFixed(3)} km`;
}

/** Build a Waypoint from a GeoPosition */
export function geoPositionToWaypoint(
  pos: GeoPosition,
  sequence: number,
): Waypoint {
  return {
    lat: pos.lat,
    lon: pos.lon,
    accuracy: pos.accuracy,
    timestamp: BigInt(Math.floor(pos.timestamp)) * 1_000_000n,
    sequence: BigInt(sequence),
  };
}
