import Common "../types/common";

module {
  public type PlotStatus = { #draft; #complete };

  // Immutable GPS waypoint (shared-safe)
  public type Waypoint = {
    lat : Float;
    lon : Float;
    timestamp : Int;     // nanoseconds
    accuracy : Float;    // metres (±3–5m typical smartphone GPS)
    sequence : Nat;
  };

  // Shared-safe (API boundary) plot record — no mutable fields, no var
  public type Plot = {
    id : Common.PlotId;
    owner : Common.UserId;
    name : Text;
    notes : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    status : PlotStatus;
    waypoints : [Waypoint];
    areaSqm : Float;      // calculated area in m²
    perimeterM : Float;   // calculated perimeter in m
  };

  // Input type for create/update calls (no id, owner, timestamps, or computed fields)
  public type PlotInput = {
    name : Text;
    notes : Text;
    waypoints : [Waypoint];
  };

  // Mutable internal plot state stored in the canister
  public type PlotInternal = {
    id : Common.PlotId;
    owner : Common.UserId;
    var name : Text;
    var notes : Text;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
    var status : PlotStatus;
    var waypoints : [Waypoint];
    var areaSqm : Float;
    var perimeterM : Float;
  };
};
