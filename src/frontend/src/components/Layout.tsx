import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { List, MapPin, Satellite } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  ocid: string;
}

function NavItem({ to, icon, label, ocid }: NavItemProps) {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      data-ocid={ocid}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-display font-medium transition-smooth",
        isActive
          ? "text-primary bg-primary/10 border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navigation bar */}
      <header
        className="bg-card border-b border-border sticky top-0 z-50"
        style={{ boxShadow: "0 1px 12px oklch(0.12 0 0 / 0.5)" }}
      >
        <div className="flex items-center justify-between h-14 px-4 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Satellite className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-lg tracking-tight">
              Blueprint<span className="text-primary"> MD</span>
            </span>
          </div>

          {/* Nav links — desktop & mobile-icon */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <NavItem
              to="/measure"
              icon={<MapPin className="w-4 h-4" />}
              label="Measure"
              ocid="nav.measure_link"
            />
            <NavItem
              to="/plots"
              icon={<List className="w-4 h-4" />}
              label="Saved Plots"
              ocid="nav.plots_link"
            />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-background">{children}</main>

      {/* Caffeine attribution footer — desktop only (hidden on mobile where bottom nav takes over) */}
      <footer className="hidden sm:flex items-center justify-center py-2 bg-muted/40 border-t border-border">
        <span className="text-[11px] text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-stretch"
        style={{ boxShadow: "0 -1px 12px oklch(0.12 0 0 / 0.5)" }}
        aria-label="Mobile navigation"
      >
        <MobileTab
          to="/measure"
          icon={<MapPin className="w-5 h-5" />}
          label="Measure"
          ocid="mobile-nav.measure_tab"
        />
        <MobileTab
          to="/plots"
          icon={<List className="w-5 h-5" />}
          label="Plots"
          ocid="mobile-nav.plots_tab"
        />
      </nav>

      {/* Mobile bottom spacer */}
      <div className="sm:hidden h-16" aria-hidden="true" />
    </div>
  );
}

function MobileTab({
  to,
  icon,
  label,
  ocid,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  ocid: string;
}) {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      data-ocid={ocid}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-display font-medium transition-smooth",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
