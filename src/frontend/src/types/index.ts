import type { Principal } from "@dfinity/principal";

export type UserId = Principal;
export type Timestamp = bigint;
export type PlotId = bigint;

export enum PlotStatus {
  complete = "complete",
  draft = "draft",
}

export interface Waypoint {
  lat: number;
  lon: number;
  timestamp: bigint;
  sequence: bigint;
  accuracy: number;
}

export interface Plot {
  id: PlotId;
  owner: UserId;
  name: string;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: PlotStatus;
  waypoints: Waypoint[];
  areaSqm: number;
  perimeterM: number;
}

export interface PlotInput {
  name: string;
  notes: string;
  waypoints: Waypoint[];
}

export interface GeoPosition {
  lat: number;
  lon: number;
  accuracy: number;
  heading: number | null;
  altitude: number | null;
  speed: number | null;
  timestamp: number;
}
