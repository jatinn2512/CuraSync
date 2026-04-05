import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bell, LogOut, Menu, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/Button";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";

interface AppLayoutProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  centerHeader?: boolean;
  hideHeader?: boolean;
  children: ReactNode;
}

const getInitials = (fullName?: string | null): string => {
  const normalized = fullName?.trim();
  if (!normalized) return "U";

  const nameParts = normalized.split(/\s+/);
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0] ?? ""}${nameParts[nameParts.length - 1][0] ?? ""}`.toUpperCase();
};

const AppLayout = ({ title, subtitle, centerHeader = false, hideHeader = false, children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isSettingsPage = location.pathname === "/settings";
  const isHealthPage = location.pathname === "/health";
  const isMobileSearchVisible = isHealthPage;
  const userInitials = useMemo(() => getInitials(user?.full_name), [user?.full_name]);

  const searchPlaceholders: Record<string, string> = {
    "/dashboard": "Search dashboard insights...",
    "/health": "Search health reports...",
    "/food": "Search meals and restaurants...",
    "/aqi": "Search AQI updates...",
    "/community": "Search community posts...",
    "/profile": "Search profile details...",
    "/settings": "Search settings...",
    "/about": "Search about and privacy...",
    "/pricing": "Search plans...",
    "/user-home": "Search home actions...",
  };
  const searchPlaceholder = searchPlaceholders[location.pathname] ?? "Search health data...";

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setUserMenuOpen(false);
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    const browserFind = (window as Window & { find?: (...args: unknown[]) => boolean }).find;
    if (typeof browserFind === "function") {
      browserFind(query, false, false, true, false, false, false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-[15.4rem] border-r border-border/60 bg-card/70 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="relative h-full w-72 border-r border-border/60 bg-card"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border-b border-border/60 p-3">
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-[calc(100%-3.25rem)] p-3">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[15.4rem]">
        <header className="sticky top-0 z-20 border-b border-border/50 bg-card/85 backdrop-blur-2xl">
          <div className="relative flex h-16 items-center gap-3 px-4 lg:px-6">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {!isMobileSearchVisible ? (
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Activity className="h-4.5 w-4.5 text-primary-foreground" />
                </span>
                <span className="font-display text-lg font-bold leading-none text-foreground">CuraSync</span>
              </div>
            ) : null}

            <div className="flex min-w-0 flex-1 items-center">
              <div className={cn("relative w-full max-w-md", !isMobileSearchVisible && "hidden lg:block", isMobileSearchVisible && "max-w-full")}>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-xl border border-border/60 bg-muted/55 pl-9 pr-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle compact />

              {isSettingsPage ? null : (
                <>
                  <Button type="button" variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-health-rose" />
                  </Button>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      title={user?.full_name || "User"}
                    >
                      {userInitials}
                    </button>
                    <AnimatePresence>
                      {userMenuOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-10 z-30 w-36 rounded-xl border border-border/60 bg-card p-1.5 shadow-lg"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-9 w-full justify-start rounded-lg text-sm"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                          >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? "Logging out..." : "Log Out"}
                          </Button>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-8 lg:p-6 lg:pb-10">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {!hideHeader && title ? (
              <section className={cn("mb-6", centerHeader && "text-center")}>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
                {subtitle ? <p className="mt-1.5 text-base text-muted-foreground">{subtitle}</p> : null}
              </section>
            ) : null}
            <div className="space-y-6">{children}</div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
