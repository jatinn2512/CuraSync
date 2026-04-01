import { type ReactNode, useState } from "react";
import { Activity, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/Button";

interface AppLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AppLayout = ({ title, subtitle, children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg-hero">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border/60 bg-card/75 p-5 backdrop-blur-xl md:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl md:hidden">
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
            <span>AI Health Companion</span>
          </button>

          <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/login")}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 border-r border-border/60 bg-card p-4">
            <div className="mb-4 flex justify-end">
              <Button type="button" variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="md:ml-72">
        <main className="container pb-10 pt-6 md:px-8 md:pt-8">
          <section className="rounded-3xl p-6 glass-card sm:p-8">
            <h1 className="text-3xl font-bold sm:text-4xl">
              <span className="gradient-text">{title}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
          </section>

          <div className="mt-6 space-y-6">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
