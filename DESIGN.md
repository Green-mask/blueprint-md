# Design Brief

## Purpose
Professional field measurement tool for on-site property surveying during construction planning. GPS/GNSS-based boundary mapping with live calculations. Used by homeowners and architects walking property boundaries.

## Aesthetic
Industrial-functional, precision-focused, high-contrast utility interface. Dark-mode dominant (outdoor usability). Monospaced numbers for measurement data. Blueprint grid sensibility. Surveying equipment UI language.

## Color Palette (OKLCH)

| Role | Light | Dark |
|------|-------|------|
| Background | 0.98 0 0 (white) | 0.25 0 0 (charcoal) |
| Card/Elevated | 0.96 0 0 | 0.42 0 0 (slate) |
| Foreground | 0.18 0 0 | 0.88 0 0 (light grey) |
| Primary/Accent | 0.62 0.18 233 (cyan) | 0.62 0.18 233 (surveyor blue) |
| Success | 0.65 0.16 142 (construction green) | 0.65 0.16 142 |
| Destructive | 0.55 0.22 25 (warning red) | 0.65 0.19 22 |
| Muted | 0.88 0 0 | 0.38 0 0 |

## Typography
**Display:** General Sans (geometric, engineering precision feel)
**Body/Data:** JetBrains Mono (monospace, technical, tabular numbers)
**Hierarchy:** Display for headers; Mono for all measurement values, coordinates, readouts.

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header | Dark card with cyan accent bar; real-time location, accuracy indicator |
| Map Area | Full-bleed interactive map, dark background, high contrast waypoints |
| Measurement Panel | Elevated card with large monospaced number readout, live stats (area, perimeter, distance) |
| Control Bar | Floating action buttons for record waypoint, clear, undo, save plot |
| Status Line | Bottom info bar; GPS accuracy, point count, mode indicator |

## Spacing & Density
Grid-based: 4px units. Compact in dark mode (on-site usability). Breathing room around measurement readouts (1rem padding). Tight controls.

## Component Patterns
- **Measurement Readout:** Large monospaced numbers (text-measurement utility), cyan accent color for live values
- **Waypoint Markers:** Small circles, cyan outline, numbered labels
- **Buttons:** Minimal, dark card backgrounds, cyan on-hover highlight
- **Status Indicators:** Real-time GPS accuracy as colored badge (green ≤5m, yellow 5–10m, red >10m)

## Motion
Smooth fade-in/slide for new waypoints. No bouncy or decorative animations. Functional transitions only: button hover (0.2s), data updates (0.15s).

## Constraints
- High contrast for outdoor readability
- Large touch targets (mobile field use)
- Monospaced numbers always for precision (no proportional fonts for data)
- Dark mode as default; light mode optional for accessibility
- No decorative gradients or ambient effects
