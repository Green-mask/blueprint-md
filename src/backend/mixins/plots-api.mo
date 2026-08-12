import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/plots";
import PlotsLib "../lib/plots";

// Public API mixin for the plots domain.
// State is injected: plots map, draft index, and a mutable counter wrapper.
mixin (
  plots      : PlotsLib.PlotMap,
  draftIndex : PlotsLib.DraftMap,
  counter    : PlotsLib.Counter,
) {

  /// Create a new (non-draft) plot for the authenticated caller.
  public shared ({ caller }) func createPlot(input : Types.PlotInput) : async Common.PlotId {
    let id = PlotsLib.create(plots, draftIndex, counter.nextId, caller, input, Time.now());
    counter.nextId += 1;
    id;
  };

  /// Update an existing plot owned by the caller.
  public shared ({ caller }) func updatePlot(plotId : Common.PlotId, input : Types.PlotInput) : async () {
    PlotsLib.update(plots, plotId, caller, input, Time.now());
  };

  /// Delete a plot owned by the caller.
  public shared ({ caller }) func deletePlot(plotId : Common.PlotId) : async () {
    PlotsLib.delete(plots, draftIndex, plotId, caller);
  };

  /// Retrieve a single plot by id (caller must be owner).
  public shared query ({ caller }) func getPlot(plotId : Common.PlotId) : async ?Types.Plot {
    PlotsLib.get(plots, plotId, caller);
  };

  /// List all plots belonging to the caller.
  public shared query ({ caller }) func listPlots() : async [Types.Plot] {
    PlotsLib.list(plots, caller);
  };

  /// Auto-save the caller's in-progress (draft) plot.
  /// Creates a draft if none exists; overwrites the existing one otherwise.
  public shared ({ caller }) func saveDraftPlot(input : Types.PlotInput) : async Common.PlotId {
    let id = PlotsLib.saveDraft(plots, draftIndex, counter.nextId, caller, input, Time.now());
    // Only increment when a new plot was created (id == previous counter value)
    if (id == counter.nextId) { counter.nextId += 1 };
    id;
  };

  /// Export a plot as a JSON-serialisable record.
  public shared query ({ caller }) func exportPlot(plotId : Common.PlotId) : async ?Types.Plot {
    PlotsLib.exportJson(plots, plotId, caller);
  };
};
