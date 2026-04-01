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

const linkClass =
  "group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200";

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        className="mb-6 flex items-center gap-2.5 font-display text-lg font-bold"
        onClick={() => {
          onNavigate?.();
          navigate("/user-home");
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl glow-primary gradient-bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <span>AI Health Companion</span>
      </button>

      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Navigation</p>

      <nav className="space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                linkClass,
                isActive
                  ? "border-transparent gradient-bg-primary text-primary-foreground shadow-soft"
                  : "border-border/60 bg-card/45 text-muted-foreground hover:border-primary/35 hover:bg-card/75 hover:text-foreground",
              )
            }
            onClick={() => onNavigate?.()}
          >
            <link.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-border/60 bg-card/65 p-4 backdrop-blur-lg">
        <p className="text-sm font-semibold">Daily Target</p>
        <p className="mt-1 text-xs text-muted-foreground">Finish 30 min walk and hydrate 2.5L today.</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[72%] rounded-full gradient-bg-primary" />
        </div>
        <p className="mt-2 text-[11px] font-medium text-primary">72% completed</p>
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
