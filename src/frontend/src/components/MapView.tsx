import type { GeoPosition, Waypoint } from "@/types";
import {
  calculateCentroid,
  calculateDistance,
  formatDistance,
  midpoint,
} from "@/utils/geo";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapSearchBar } from "@/components/MapSearchBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Fix Leaflet default icon path in bundled environments
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom waypoint icon factory
function makeWaypointIcon(label: string, isFirst: boolean, isClosed: boolean) {
  const color = isFirst && isClosed ? "#06b6d4" : "#22d3ee";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${isFirst ? (isClosed ? "#06b6d4" : "#0e7490") : "oklch(0.25 0 0)"};
      border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      color:${color};font-family:'JetBrains Mono',monospace;
      font-size:10px;font-weight:700;
      box-shadow:0 0 8px ${color}66;
      cursor:pointer;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// User position pulsing icon
const userPositionIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="
      position:absolute;inset:0;border-radius:50%;
      background:oklch(0.62 0.18 233 / 0.2);
      animation:pulse 2s infinite;
    "></div>
    <div style="
      position:absolute;inset:3px;border-radius:50%;
      background:oklch(0.62 0.18 233);
      border:2px solid white;
      box-shadow:0 0 6px oklch(0.62 0.18 233 / 0.8);
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Centroid icon
const centroidIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:10px;height:10px;border-radius:50%;
    background:oklch(0.62 0.18 233 / 0.6);
    border:1px solid oklch(0.62 0.18 233);
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// Tile config
const TILES = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    label: "Street",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery",
    label: "Satellite",
  },
} as const;

type TileKey = keyof typeof TILES;

/** Pan/zoom to user position when first acquired */
function MapAutoCenter({
  position,
  hasCentered,
  onCentered,
}: {
  position: GeoPosition | null;
  hasCentered: boolean;
  onCentered: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (position && !hasCentered) {
      map.setView([position.lat, position.lon], 18);
      onCentered();
    }
  }, [position, hasCentered, map, onCentered]);
  return null;
}

/** Track user position re-center on WALK mode */
function MapFollowUser({
  position,
  captureMode,
}: {
  position: GeoPosition | null;
  captureMode: "tap" | "walk";
}) {
  const map = useMap();
  const prevRef = useRef<GeoPosition | null>(null);
  useEffect(() => {
    if (position && captureMode === "walk") {
      const prev = prevRef.current;
      if (!prev || calculateDistance(prev, position) > 2) {
        map.panTo([position.lat, position.lon], {
          animate: true,
          duration: 0.8,
        });
        prevRef.current = position;
      }
    }
  }, [position, captureMode, map]);
  return null;
}

/** Capture tap events on the map */
function MapClickCapture({
  enabled,
  onTap,
}: {
  enabled: boolean;
  onTap: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (enabled) {
        onTap(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

/**
 * Renders the search bar into a portal div that sits absolutely over the map,
 * to the left of the tile toggle. Must be inside MapContainer to use useMap().
 */
function SearchBarOverlay({
  portalTarget,
}: { portalTarget: HTMLElement | null }) {
  if (!portalTarget) return null;
  return createPortal(<MapSearchBar />, portalTarget);
}

export interface MapViewProps {
  position: GeoPosition | null;
  waypoints: Waypoint[];
  isClosed: boolean;
  captureMode: "tap" | "walk";
  onAddWaypoint: (lat: number, lon: number) => void;
  onClosePlot: () => void;
}

export function MapView({
  position,
  waypoints,
  isClosed,
  captureMode,
  onAddWaypoint,
  onClosePlot,
}: MapViewProps) {
  const [tileKey, setTileKey] = useState<TileKey>("satellite");
  const [hasCentered, setHasCentered] = useState(false);
  // Ref to the portal div where the search bar will be rendered
  const searchPortalRef = useRef<HTMLDivElement | null>(null);
  const [searchPortalReady, setSearchPortalReady] = useState(false);

  const defaultCenter: L.LatLngTuple = [51.505, -0.09];
  const tile = TILES[tileKey];

  const latlngs: L.LatLngTuple[] = waypoints.map((wp) => [wp.lat, wp.lon]);
  const centroid =
    isClosed && waypoints.length >= 3 ? calculateCentroid(waypoints) : null;

  const handleMarkerClick = useCallback(
    (index: number) => {
      if (index === 0 && !isClosed && waypoints.length >= 3) {
        onClosePlot();
      }
    },
    [isClosed, waypoints.length, onClosePlot],
  );

  return (
    <div className="relative w-full h-full" data-ocid="measure.map">
      {/* Controls row: search bar portal target + tile toggle */}
      <div
        className="absolute top-3 right-3 z-[1000] flex items-center gap-2"
        data-ocid="measure.map_controls"
      >
        {/* Search bar portal target — only shown on desktop */}
        <div
          ref={(el) => {
            if (el && !searchPortalRef.current) {
              searchPortalRef.current = el as HTMLDivElement;
              setSearchPortalReady(true);
            }
          }}
          className="hidden sm:block"
          data-ocid="measure.search_portal"
        />

        {/* Tile toggle */}
        <div
          className="flex rounded-lg overflow-hidden border border-border shadow-md"
          data-ocid="measure.tile_toggle"
        >
          {(Object.keys(TILES) as TileKey[]).map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setTileKey(k)}
              data-ocid={`measure.tile_${k}`}
              className={`px-3 py-1.5 text-xs font-mono transition-smooth ${
                tileKey === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {TILES[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* Pulsing CSS animation injected */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={tile.url} attribution={tile.attribution} />

        <MapAutoCenter
          position={position}
          hasCentered={hasCentered}
          onCentered={() => setHasCentered(true)}
        />
        <MapFollowUser position={position} captureMode={captureMode} />
        <MapClickCapture
          enabled={captureMode === "tap" && !isClosed}
          onTap={onAddWaypoint}
        />

        {/* Search bar rendered inside MapContainer (needs useMap) via portal */}
        {searchPortalReady && (
          <SearchBarOverlay portalTarget={searchPortalRef.current} />
        )}

        {/* User position */}
        {position && (
          <>
            <Marker
              position={[position.lat, position.lon]}
              icon={userPositionIcon}
            />
            <Circle
              center={[position.lat, position.lon]}
              radius={position.accuracy}
              pathOptions={{
                color: "oklch(0.62 0.18 233)",
                fillColor: "oklch(0.62 0.18 233)",
                fillOpacity: 0.08,
                weight: 1,
                dashArray: "4 4",
              }}
            />
          </>
        )}

        {/* Polyline between waypoints */}
        {latlngs.length >= 2 && !isClosed && (
          <Polyline
            positions={latlngs}
            pathOptions={{
              color: "#22d3ee",
              weight: 2,
              opacity: 0.9,
              dashArray: "6 4",
            }}
          />
        )}

        {/* Closed polygon fill */}
        {isClosed && latlngs.length >= 3 && (
          <Polygon
            positions={latlngs}
            pathOptions={{
              color: "#06b6d4",
              weight: 2,
              opacity: 1,
              fillColor: "#06b6d4",
              fillOpacity: 0.12,
            }}
          />
        )}

        {/* Edge distance labels */}
        {waypoints.length >= 2 &&
          waypoints.map((wp, i) => {
            const next = waypoints[(i + 1) % waypoints.length];
            if (!isClosed && i === waypoints.length - 1) return null;
            const dist = calculateDistance(wp, next);
            const mid = midpoint(wp, next);
            return (
              <Marker
                key={`edge-${wp.lat.toFixed(6)}-${wp.lon.toFixed(6)}`}
                position={[mid.lat, mid.lon]}
                icon={L.divIcon({
                  className: "",
                  html: `<div style="
                    background:oklch(0.25 0 0 / 0.85);
                    border:1px solid oklch(0.35 0 0);
                    border-radius:3px;padding:1px 5px;
                    font-family:'JetBrains Mono',monospace;
                    font-size:10px;color:#a3e8f4;white-space:nowrap;
                    box-shadow:0 1px 4px oklch(0.1 0 0 / 0.6);
                  ">${formatDistance(dist)}</div>`,
                  iconAnchor: [0, 0],
                })}
              />
            );
          })}

        {/* Waypoint markers */}
        {waypoints.map((wp, i) => (
          <Marker
            key={`wp-${wp.lat.toFixed(6)}-${wp.lon.toFixed(6)}-${i}`}
            position={[wp.lat, wp.lon]}
            icon={makeWaypointIcon(String(i + 1), i === 0, isClosed)}
            eventHandlers={{ click: () => handleMarkerClick(i) }}
            data-ocid={`measure.waypoint.${i + 1}`}
          >
            <Popup>
              <div className="font-mono text-xs space-y-0.5">
                <div className="font-bold text-primary">Waypoint {i + 1}</div>
                <div>Lat: {wp.lat.toFixed(7)}</div>
                <div>Lon: {wp.lon.toFixed(7)}</div>
                <div>±{wp.accuracy.toFixed(1)} m</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Centroid */}
        {centroid && (
          <Marker position={[centroid.lat, centroid.lon]} icon={centroidIcon}>
            <Popup>
              <div className="font-mono text-xs">
                <div className="font-bold text-primary">Centroid</div>
                <div>{centroid.lat.toFixed(7)}</div>
                <div>{centroid.lon.toFixed(7)}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
