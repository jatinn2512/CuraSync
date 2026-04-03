import { motion } from "framer-motion";
import {
  AirVent,
  ArrowRight,
  HeartPulse,
  LayoutDashboard,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const modules = [
  {
    title: "See your progress in one place",
    description: "Open your dashboard to review today's streaks, pending actions, and weekly momentum.",
    to: "/dashboard",
    icon: LayoutDashboard,
    color: "text-primary",
    label: "Dashboard",
    cta: "Open Dashboard",
  },
  {
    title: "Track symptoms and daily vitals",
    description: "Log health updates, monitor trends, and check personalized AI insights for better decisions.",
    to: "/health",
    icon: HeartPulse,
    color: "text-primary",
    label: "Health",
    cta: "Track Health",
  },
  {
    title: "Plan meals with better consistency",
    description: "Manage calories, macros, and hydration targets so your nutrition stays aligned with goals.",
    to: "/food",
    icon: Leaf,
    color: "text-primary",
    label: "Food",
    cta: "Manage Food",
  },
  {
    title: "Stay updated with your local AQI",
    description: "Check live air quality, understand exposure risk, and plan safe outdoor activity windows.",
    to: "/aqi",
    icon: AirVent,
    color: "text-primary",
    label: "AQI",
    cta: "Check AQI",
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
  const resolvedName = displayName || "User";

  return (
    <AppLayout
      title={`Welcome Back, ${resolvedName}`}
      subtitle=""
      centerHeader
    >
      <section className="mx-auto w-full max-w-5xl space-y-5">
        {modules.map((module, index) => {
          const isReverse = index % 2 === 1;

          return (
            <motion.article
              key={module.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="relative overflow-hidden rounded-3xl px-6 py-7 glass-card hover-lift sm:min-h-[250px] sm:px-8 sm:py-9"
            >
              <div className="relative grid gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-start">
                <div className={cn("space-y-3", isReverse ? "md:order-2" : "md:order-1")}>
                  <p className="inline-flex items-center gap-2 px-0 py-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <module.icon className={cn("h-3.5 w-3.5", module.color)} />
                    {module.label}
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight text-foreground sm:text-[1.72rem]">{module.title}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">{module.description}</p>
                </div>

                <div
                  className={cn(
                    "flex items-start justify-start",
                    isReverse ? "md:order-1" : "md:order-2",
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <module.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className={cn("mt-7 flex", isReverse ? "justify-start" : "justify-end")}>
                <Button
                  type="button"
                  className="h-12 w-full max-w-sm justify-between border-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate(module.to)}
                >
                  {module.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.article>
          );
        })}
      </section>
    </AppLayout>
  );
};

export default UserHome;
