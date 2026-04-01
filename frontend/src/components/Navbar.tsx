import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Features", href: "#features", section: "features" },
  { label: "How It Works", href: "#how-it-works", section: "how-it-works" },
  { label: "Benefits", href: "#benefits", section: "benefits" },
  { label: "Testimonials", href: "#testimonials", section: "testimonials" },
];

interface NavbarProps {
  onSectionClick: (section: string) => void;
}

const Navbar = ({ onSectionClick }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSectionClick = (section: string) => {
    setMobileOpen(false);
    onSectionClick(section);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-card/60 backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="container flex h-16 items-center justify-between">
        <button
          type="button"
          className="group flex items-center gap-2.5 font-display text-lg font-bold"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 glow-primary gradient-bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Health Companion</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              onClick={(event) => {
                event.preventDefault();
                handleSectionClick(link.section);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle compact />
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button
            size="sm"
            className="border-0 gradient-bg-primary text-primary-foreground"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="rounded-xl border border-border/55 bg-card/70 p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/40 bg-card/90 backdrop-blur-2xl md:hidden"
          >
            <div className="container flex flex-col gap-3 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSectionClick(link.section);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <ThemeToggle className="w-full justify-start" showLabel />
              <div className="flex gap-3 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  className="flex-1 border-0 gradient-bg-primary text-primary-foreground"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
