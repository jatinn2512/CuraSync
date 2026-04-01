import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 glass-card">
      <div className="container flex h-16 items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 font-display text-lg font-bold"
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Health Companion</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={(event) => {
                event.preventDefault();
                handleSectionClick(link.section);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
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
          className="p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/40 glass-card md:hidden"
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
              <div className="flex gap-3 pt-2">
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
