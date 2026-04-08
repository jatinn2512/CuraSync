import { Activity, AirVent, BarChart3, BellRing, ChevronRight, HeartPulse, LayoutDashboard, Leaf, Settings, User, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Health", to: "/health", icon: HeartPulse },
  { label: "Food", to: "/food", icon: Leaf },
  { label: "AQI", to: "/aqi", icon: AirVent },
  { label: "Analysis", to: "/analysis", icon: BarChart3 },
  { label: "Instant Alert", to: "/instant-alert", icon: BellRing },
  { label: "Community", to: "/community", icon: Users },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <button
        type="button"
        className="flex items-center gap-3 border-b border-border/60 px-4 py-6 text-left"
        onClick={() => {
          onNavigate?.();
          navigate("/dashboard");
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5.5 w-5.5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-display text-[18px] font-bold leading-none">CuraSync</p>
          <p className="mt-1 text-xs text-muted-foreground">Health Dashboard</p>
        </div>
      </button>

      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
                {isActive ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-3.5">
          <p className="text-center text-sm text-muted-foreground">Upgrade to Pro</p>
          <Button
            type="button"
            className="mt-2.5 h-10 w-full rounded-lg bg-primary text-sm text-primary-foreground"
            onClick={() => {
              onNavigate?.();
              navigate("/pricing");
            }}
          >
            Go Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
