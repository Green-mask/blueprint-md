import Map "mo:core/Map";
import Common "types/common";
import Types "types/plots";
import PlotsLib "lib/plots";
import PlotsApi "mixins/plots-api";

actor {
  // ── Stable state ─────────────────────────────────────────────────────────
  let plots : PlotsLib.PlotMap = Map.empty<Common.PlotId, Types.PlotInternal>();
  let draftIndex : PlotsLib.DraftMap = Map.empty<Common.UserId, Common.PlotId>();
  let nextPlotId : Nat = 0;
  // Counter wrapper so the mixin can mutate nextPlotId by reference.
  let counter : PlotsLib.Counter = { var nextId = nextPlotId };

  // ── Mixin composition ────────────────────────────────────────────────────
  include PlotsApi(plots, draftIndex, counter);
};
