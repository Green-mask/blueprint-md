import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface PlotInput {
    name: string;
    waypoints: Array<Waypoint>;
    notes: string;
}
export type PlotId = bigint;
export interface Plot {
    id: PlotId;
    status: PlotStatus;
    owner: UserId;
    name: string;
    createdAt: Timestamp;
    waypoints: Array<Waypoint>;
    updatedAt: Timestamp;
    notes: string;
    areaSqm: number;
    perimeterM: number;
}
export interface Waypoint {
    lat: number;
    lon: number;
    timestamp: bigint;
    sequence: bigint;
    accuracy: number;
}
export enum PlotStatus {
    complete = "complete",
    draft = "draft"
}
export interface backendInterface {
    createPlot(input: PlotInput): Promise<PlotId>;
    deletePlot(plotId: PlotId): Promise<void>;
    exportPlot(plotId: PlotId): Promise<Plot | null>;
    getPlot(plotId: PlotId): Promise<Plot | null>;
    listPlots(): Promise<Array<Plot>>;
    saveDraftPlot(input: PlotInput): Promise<PlotId>;
    updatePlot(plotId: PlotId, input: PlotInput): Promise<void>;
}
