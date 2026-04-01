import {
  Activity,
  AirVent,
  HeartPulse,
  LayoutDashboard,
  Leaf,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "User Home", to: "/user-home", icon: Activity },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Health", to: "/health", icon: HeartPulse },
  { label: "Food", to: "/food", icon: Leaf },
  { label: "AQI", to: "/aqi", icon: AirVent },
  { label: "Community", to: "/community", icon: Users },
  { label: "Profile", to: "/profile", icon: User },
];

interface SidebarProps {
  onNavigate?: () => void;
}

const linkClass = "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors";

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        className="mb-6 flex items-center gap-2 font-display text-lg font-bold"
        onClick={() => {
          onNavigate?.();
          navigate("/user-home");
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <span>AI Health Companion</span>
      </button>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                linkClass,
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
            onClick={() => onNavigate?.()}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-border/60 bg-card/70 p-4">
        <p className="text-sm font-semibold">Daily Target</p>
        <p className="mt-1 text-xs text-muted-foreground">Finish 30 min walk and hydrate 2.5L today.</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          onClick={() => {
            onNavigate?.();
            navigate("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
