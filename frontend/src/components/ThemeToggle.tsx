import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import useTheme from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
}

const ThemeToggle = ({ className, compact = false, showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? "icon" : "default"}
      className={cn(
        "border border-border/60 bg-card/75 backdrop-blur-md hover:bg-card/95 dark:bg-card dark:hover:bg-card",
        compact ? "h-10 w-10 rounded-xl" : "h-10 rounded-xl px-3.5",
        className,
      )}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun className="h-[18px] w-[18px] text-amber-400" /> : <MoonStar className="h-[18px] w-[18px] text-cyan-500" />}
      {showLabel && <span className="text-xs font-semibold">{isDark ? "Light" : "Dark"} mode</span>}
    </Button>
  );
};

export default ThemeToggle;
