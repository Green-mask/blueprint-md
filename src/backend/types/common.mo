import Principal "mo:core/Principal";

module {
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())
  public type PlotId = Nat;
};
