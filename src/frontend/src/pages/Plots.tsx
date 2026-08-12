import { PlotCard } from "@/components/PlotCard";
import { PlotDetailDrawer } from "@/components/PlotDetailDrawer";
import {
  type FilterTab,
  PlotSearchFilter,
} from "@/components/PlotSearchFilter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPlots } from "@/hooks/useBackendPlots";
import type { Plot } from "@/types";
import { PlotStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      data-ocid="plots.empty_state"
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-primary/60" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">
            No plots match your search
          </h3>
          <p className="text-muted-foreground font-body text-sm max-w-xs">
            Try a different search term or filter.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">
            No plots yet
          </h3>
          <p className="text-muted-foreground font-body text-sm max-w-xs mb-6">
            Start measuring a property to save your first land plot.
          </p>
          <Button asChild data-ocid="plots.start_measuring_button">
            <Link to="/measure">
              <MapPin className="w-4 h-4 mr-2" />
              Start Measuring
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      data-ocid="plots.error_state"
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-destructive/70" />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
        Failed to load plots
      </h3>
      <p className="text-muted-foreground font-body text-sm mb-6 max-w-xs">
        There was a problem fetching your saved plots from the backend.
      </p>
      <Button
        data-ocid="plots.retry_button"
        variant="outline"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );
}

export default function PlotsPage() {
  const {
    data: plots = [],
    isLoading,
    isPending,
    isError,
    refetch,
  } = useListPlots();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drafts always come first, then sort by updatedAt desc
  const sortedPlots = useMemo(() => {
    return [...plots].sort((a, b) => {
      const aDraft = a.status === PlotStatus.draft ? 1 : 0;
      const bDraft = b.status === PlotStatus.draft ? 1 : 0;
      if (bDraft !== aDraft) return bDraft - aDraft;
      return Number(b.updatedAt - a.updatedAt);
    });
  }, [plots]);

  const filteredPlots = useMemo(() => {
    return sortedPlots.filter((plot) => {
      const matchesSearch = plot.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "complete" && plot.status === PlotStatus.complete) ||
        (filter === "draft" && plot.status === PlotStatus.draft);
      return matchesSearch && matchesFilter;
    });
  }, [sortedPlots, search, filter]);

  function openPlot(plot: Plot) {
    setSelectedPlot(plot);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setSelectedPlot(null), 300);
  }

  const hasFilters = search.length > 0 || filter !== "all";

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display font-bold text-foreground text-xl tracking-tight">
                Saved Plots
              </h1>
              <p className="text-muted-foreground text-xs font-body mt-0.5">
                {plots.length} {plots.length === 1 ? "plot" : "plots"} stored
              </p>
            </div>
            <Button
              asChild
              size="sm"
              data-ocid="plots.new_measurement_button"
              className="shrink-0"
            >
              <Link to="/measure">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                New
              </Link>
            </Button>
          </div>

          {(plots.length > 0 || hasFilters) && !isLoading && !isError && (
            <PlotSearchFilter
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
              totalCount={plots.length}
              filteredCount={filteredPlots.length}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {isLoading || isPending ? (
            <div
              data-ocid="plots.loading_state"
              className="space-y-3"
              aria-busy="true"
              aria-label="Loading plots"
            >
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : filteredPlots.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <ul
              data-ocid="plots.list"
              className="space-y-3"
              aria-label="Saved plots"
            >
              {filteredPlots.map((plot, i) => (
                <li key={plot.id.toString()}>
                  <PlotCard plot={plot} index={i + 1} onOpen={openPlot} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <PlotDetailDrawer
        plot={selectedPlot}
        open={drawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
}
