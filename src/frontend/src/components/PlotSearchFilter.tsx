import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export type FilterTab = "all" | "complete" | "draft";

interface PlotSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: FilterTab;
  onFilterChange: (value: FilterTab) => void;
  totalCount: number;
  filteredCount: number;
}

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "draft", label: "Draft" },
];

export function PlotSearchFilter({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  totalCount,
  filteredCount,
}: PlotSearchFilterProps) {
  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          data-ocid="plots.search_input"
          type="search"
          placeholder="Search plots by name…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-muted/30 border-border focus:border-primary font-body"
        />
      </div>

      {/* Filter tabs + count */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-1 bg-muted/40 border border-border rounded-md p-0.5"
          role="tablist"
          aria-label="Filter plots"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={filter === tab.value}
              data-ocid={`plots.filter.${tab.value}`}
              onClick={() => onFilterChange(tab.value)}
              type="button"
              className={cn(
                "px-3 py-1 rounded text-xs font-display font-medium transition-smooth",
                filter === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-body tabular-nums">
          {filteredCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
