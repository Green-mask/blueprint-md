import Map "mo:core/Map";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Common "../types/common";
import Types "../types/plots";
import Nat "mo:core/Nat";

module {
  // ── Types re-exported for convenience ────────────────────────────────────
  public type PlotMap = Map.Map<Common.PlotId, Types.PlotInternal>;
  public type DraftMap = Map.Map<Common.UserId, Common.PlotId>;

  /// Mutable counter wrapper so the mixin can increment nextId by reference.
  public type Counter = { var nextId : Nat };

  // ── Geometry helpers ─────────────────────────────────────────────────────

  /// Haversine distance in metres between two lat/lon coordinates.
  func haversineM(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
    let r : Float = 6_371_000.0; // Earth radius in metres
    let toRad : Float -> Float = func(d) { d * Float.pi / 180.0 };
    let dLat = toRad(lat2 - lat1);
    let dLon = toRad(lon2 - lon1);
    let a = Float.sin(dLat / 2.0) * Float.sin(dLat / 2.0)
          + Float.cos(toRad(lat1)) * Float.cos(toRad(lat2))
          * Float.sin(dLon / 2.0) * Float.sin(dLon / 2.0);
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    r * c;
  };

  /// Calculate the geodesic perimeter (m) and approximate area (m²) using
  /// the Shoelace formula on projected lat/lon (acceptable for small parcels)
  /// plus Haversine for perimeter.
  public func calculateGeometry(waypoints : [Types.Waypoint]) : { areaSqm : Float; perimeterM : Float } {
    let n = waypoints.size();
    if (n < 2) { return { areaSqm = 0.0; perimeterM = 0.0 } };

    // Perimeter: sum Haversine distances between consecutive waypoints, closing the polygon
    var perim : Float = 0.0;
    var i : Nat = 0;
    while (i < n) {
      let j = (i + 1) % n;
      perim := perim + haversineM(waypoints[i].lat, waypoints[i].lon,
                                  waypoints[j].lat, waypoints[j].lon);
      i += 1;
    };

    // Area: Shoelace formula on lat/lon scaled to metres.
    // Use the centroid as origin to reduce floating-point error.
    var sumLat : Float = 0.0;
    var sumLon : Float = 0.0;
    for (wp in waypoints.values()) {
      sumLat += wp.lat;
      sumLon += wp.lon;
    };
    let cLat = sumLat / n.toFloat();
    let cLon = sumLon / n.toFloat();
    let metersPerDegLat : Float = 111_320.0;
    let metersPerDegLon : Float = 111_320.0 * Float.cos(cLat * Float.pi / 180.0);

    var shoelace : Float = 0.0;
    var k : Nat = 0;
    while (k < n) {
      let l = (k + 1) % n;
      let xk = (waypoints[k].lon - cLon) * metersPerDegLon;
      let yk = (waypoints[k].lat - cLat) * metersPerDegLat;
      let xl = (waypoints[l].lon - cLon) * metersPerDegLon;
      let yl = (waypoints[l].lat - cLat) * metersPerDegLat;
      shoelace += xk * yl - xl * yk;
      k += 1;
    };
    let area = Float.abs(shoelace) / 2.0;

    { areaSqm = area; perimeterM = perim };
  };

  // ── Internal ↔ shared conversion ─────────────────────────────────────────

  /// Convert mutable internal record to immutable shared record.
  public func toPublic(self : Types.PlotInternal) : Types.Plot {
    {
      id        = self.id;
      owner     = self.owner;
      name      = self.name;
      notes     = self.notes;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
      status    = self.status;
      waypoints = self.waypoints;
      areaSqm   = self.areaSqm;
      perimeterM = self.perimeterM;
    };
  };

  // ── CRUD helpers ──────────────────────────────────────────────────────────

  /// Create a new complete PlotInternal, insert into map, increment counter.
  /// Returns the new plot id.
  public func create(
    plots      : PlotMap,
    _draftIndex : DraftMap,
    nextId     : Nat,
    owner      : Common.UserId,
    input      : Types.PlotInput,
    now        : Common.Timestamp,
  ) : Common.PlotId {
    let plotId = nextId;
    let geo = calculateGeometry(input.waypoints);
    let plot : Types.PlotInternal = {
      id         = plotId;
      owner      = owner;
      var name   = input.name;
      var notes  = input.notes;
      createdAt  = now;
      var updatedAt = now;
      var status = #complete;
      var waypoints = input.waypoints;
      var areaSqm   = geo.areaSqm;
      var perimeterM = geo.perimeterM;
    };
    plots.add(plotId, plot);
    plotId;
  };

  /// Upsert the caller's draft: update existing draft or create a new one.
  /// Returns the plot id of the upserted draft.
  public func saveDraft(
    plots      : PlotMap,
    draftIndex : DraftMap,
    nextId     : Nat,
    owner      : Common.UserId,
    input      : Types.PlotInput,
    now        : Common.Timestamp,
  ) : Common.PlotId {
    let geo = calculateGeometry(input.waypoints);
    switch (draftIndex.get(owner)) {
      case (?existingId) {
        switch (plots.get(existingId)) {
          case (?p) {
            p.name      := input.name;
            p.notes     := input.notes;
            p.waypoints := input.waypoints;
            p.updatedAt := now;
            p.areaSqm   := geo.areaSqm;
            p.perimeterM := geo.perimeterM;
            existingId;
          };
          case null {
            // stale index entry — create fresh
            let plotId = nextId;
            let plot : Types.PlotInternal = {
              id         = plotId;
              owner      = owner;
              var name   = input.name;
              var notes  = input.notes;
              createdAt  = now;
              var updatedAt = now;
              var status = #draft;
              var waypoints = input.waypoints;
              var areaSqm   = geo.areaSqm;
              var perimeterM = geo.perimeterM;
            };
            plots.add(plotId, plot);
            draftIndex.add(owner, plotId);
            plotId;
          };
        };
      };
      case null {
        let plotId = nextId;
        let plot : Types.PlotInternal = {
          id         = plotId;
          owner      = owner;
          var name   = input.name;
          var notes  = input.notes;
          createdAt  = now;
          var updatedAt = now;
          var status = #draft;
          var waypoints = input.waypoints;
          var areaSqm   = geo.areaSqm;
          var perimeterM = geo.perimeterM;
        };
        plots.add(plotId, plot);
        draftIndex.add(owner, plotId);
        plotId;
      };
    };
  };

  /// Update an existing plot owned by `owner`. Traps if not found or not owned.
  public func update(
    plots  : PlotMap,
    plotId : Common.PlotId,
    owner  : Common.UserId,
    input  : Types.PlotInput,
    now    : Common.Timestamp,
  ) : () {
    let p = switch (plots.get(plotId)) {
      case (?p) p;
      case null Runtime.trap("Plot not found");
    };
    if (not Principal.equal(p.owner, owner)) Runtime.trap("Not owner");
    let geo = calculateGeometry(input.waypoints);
    p.name       := input.name;
    p.notes      := input.notes;
    p.waypoints  := input.waypoints;
    p.updatedAt  := now;
    p.areaSqm    := geo.areaSqm;
    p.perimeterM := geo.perimeterM;
  };

  /// Delete a plot owned by `owner`. Traps if not found or not owned.
  public func delete(
    plots      : PlotMap,
    draftIndex : DraftMap,
    plotId     : Common.PlotId,
    owner      : Common.UserId,
  ) : () {
    let p = switch (plots.get(plotId)) {
      case (?p) p;
      case null Runtime.trap("Plot not found");
    };
    if (not Principal.equal(p.owner, owner)) Runtime.trap("Not owner");
    plots.remove(plotId);
    // clean up draft index if this was a draft
    switch (draftIndex.get(owner)) {
      case (?id) { if (id == plotId) { draftIndex.remove(owner) } };
      case null {};
    };
  };

  /// Get a single plot by id. Returns null if not found or not owned by caller.
  public func get(
    plots  : PlotMap,
    plotId : Common.PlotId,
    owner  : Common.UserId,
  ) : ?Types.Plot {
    switch (plots.get(plotId)) {
      case (?p) {
        if (Principal.equal(p.owner, owner)) ?toPublic(p)
        else null;
      };
      case null null;
    };
  };

  /// Return all plots owned by `owner` as an immutable array.
  public func list(
    plots : PlotMap,
    owner : Common.UserId,
  ) : [Types.Plot] {
    let iter = plots.values()
      .filter(func(p : Types.PlotInternal) : Bool { Principal.equal(p.owner, owner) })
      .map(func(p) { toPublic(p) });
    iter.toArray();
  };

  /// Export a plot as a JSON-serialisable record (caller must own it).
  public func exportJson(
    plots  : PlotMap,
    plotId : Common.PlotId,
    owner  : Common.UserId,
  ) : ?Types.Plot {
    get(plots, plotId, owner);
  };
};
