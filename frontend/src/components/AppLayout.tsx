import { type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  centerHeader?: boolean;
  children: ReactNode;
}

const AppLayout = ({ title, subtitle, centerHeader = false, children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-clip gradient-bg-hero">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-health-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-health-violet/15 blur-3xl" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[18.5rem] border-r border-border/60 bg-card/65 p-5 backdrop-blur-2xl md:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-50 border-b border-border/45 bg-card/70 backdrop-blur-2xl md:hidden">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <button
            type="button"
            className="flex items-center gap-2 font-display text-sm font-bold"
            onClick={() => navigate("/user-home")}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>CuraSync</span>
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/login")}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-72 border-r border-border/65 bg-card/95 p-4 backdrop-blur-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <ThemeToggle compact />
                <Button type="button" variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative md:ml-[18.5rem]">
        <main className="container pb-10 pt-6 md:px-8 md:pt-8">
          <div className="mb-4 hidden justify-end gap-2 md:flex">
            <ThemeToggle compact />
            <Button type="button" variant="outline" className="h-10 px-3.5" onClick={() => navigate("/login")}>
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>

          <section className="relative overflow-hidden rounded-[1.75rem] p-6 glass-card sm:p-8">
            <div className="relative z-10">
              <h1 className={cn("text-3xl font-bold sm:text-4xl", centerHeader && "text-center")}>
                <span className="gradient-text">{title}</span>
              </h1>
              <p className={cn("mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary", centerHeader && "w-full justify-center")}>
                <Sparkles className="h-3.5 w-3.5" />
                Personalized Wellness Dashboard
              </p>
              {subtitle ? (
                <p className={cn("mt-3 max-w-2xl text-balance text-muted-foreground", centerHeader && "mx-auto text-center")}>{subtitle}</p>
              ) : null}
            </div>
          </section>

          <div className="mt-7 space-y-6">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
