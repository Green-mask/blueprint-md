import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
}

/** Inner component — must be rendered inside MapContainer to access the map instance */
export function MapSearchBar() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced Nominatim search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "BlueprintMD/1.0" },
      });
      if (!res.ok) throw new Error("Nominatim error");
      const data = (await res.json()) as NominatimResult[];
      setResults(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void doSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Stop map click/scroll propagation inside the search box
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("click", stop);
    el.addEventListener("dblclick", stop);
    el.addEventListener("wheel", stop);
    el.addEventListener("touchstart", stop);
    return () => {
      el.removeEventListener("click", stop);
      el.removeEventListener("dblclick", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, []);

  function selectResult(r: NominatimResult) {
    map.flyTo([Number.parseFloat(r.lat), Number.parseFloat(r.lon)], 16, {
      animate: true,
      duration: 1.2,
    });
    setQuery(r.display_name.split(",")[0]);
    setIsOpen(false);
    setResults([]);
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectResult(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minWidth: 180,
        maxWidth: 300,
        width: "clamp(180px, 30vw, 300px)",
        fontFamily: "var(--font-body, sans-serif)",
      }}
      data-ocid="measure.search_bar"
    >
      {/* Input wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--card, #fff)",
          border: "1px solid var(--border, #e2e8f0)",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          height: 36,
          padding: "0 8px",
          gap: 6,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Loader2
            style={{
              width: 15,
              height: 15,
              color: "var(--primary, #06b6d4)",
              flexShrink: 0,
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <Search
            style={{
              width: 15,
              height: 15,
              color: "var(--muted-foreground, #64748b)",
              flexShrink: 0,
            }}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search location…"
          aria-label="Search for a location"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          data-ocid="measure.search_input"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            color: "var(--foreground, #0f172a)",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            data-ocid="measure.search_clear_button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <X
              style={{
                width: 14,
                height: 14,
                color: "var(--muted-foreground, #64748b)",
              }}
            />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          aria-label="Location suggestions"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--card, #fff)",
            border: "1px solid var(--border, #e2e8f0)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
            zIndex: 2000,
            listStyle: "none",
            margin: 0,
            padding: "4px 0",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {results.map((r, i) => (
            <div
              key={r.place_id}
              aria-selected={i === activeIndex}
              onMouseDown={() => selectResult(r)}
              onMouseEnter={() => setActiveIndex(i)}
              data-ocid={`measure.search_result.${i + 1}`}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 12,
                color: "var(--foreground, #0f172a)",
                background:
                  i === activeIndex ? "var(--muted, #f1f5f9)" : "transparent",
                lineHeight: 1.4,
                transition: "background 0.1s",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.display_name.split(",")[0]}
              </span>
              <span
                style={{
                  color: "var(--muted-foreground, #64748b)",
                  fontSize: 11,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {r.display_name.split(",").slice(1).join(",").trim()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
