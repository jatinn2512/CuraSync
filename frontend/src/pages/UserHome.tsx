import { motion } from "framer-motion";
import {
  AirVent,
  HeartPulse,
  LayoutDashboard,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";

const cards = [
  {
    title: "Open Dashboard",
    description: "See your full health snapshot, tasks, and daily progress.",
    to: "/dashboard",
    icon: LayoutDashboard,
    color: "text-health-indigo",
    cta: "Go to Open",
  },
  {
    title: "Track Health",
    description: "Log symptoms, monitor vitals, and view AI health insights.",
    to: "/health",
    icon: HeartPulse,
    color: "text-health-teal",
    cta: "Go to Track",
  },
  {
    title: "Manage Food",
    description: "Plan meals, calories, macros, and hydration targets.",
    to: "/food",
    icon: Leaf,
    color: "text-health-rose",
    cta: "Go to Manage",
  },
  {
    title: "Check AQI",
    description: "Monitor local air quality and breathing safety tips.",
    to: "/aqi",
    icon: AirVent,
    color: "text-health-cyan",
    cta: "Go to Check",
  },
];

const UserHome = () => {
  const navigate = useNavigate();
  let displayName = "";

  // This can be set later by the login flow without changing this page.
  try {
    displayName = window.localStorage.getItem("health-companion-user-name")?.trim() ?? "";
  } catch {
    displayName = "";
  }

  return (
    <AppLayout
      title={displayName ? `Welcome Back, ${displayName}` : "Welcome Back"}
      subtitle="Pick what you want to focus on and continue your health journey."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="rounded-2xl p-5 glass-card hover-lift"
          >
            <div className="mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card/70">
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate(card.to)}
            >
              {card.cta}
            </Button>
          </motion.article>
        ))}
      </section>
    </AppLayout>
  );
};

export default UserHome;
