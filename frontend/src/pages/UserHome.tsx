import { motion } from "framer-motion";
import {
  AirVent,
  ArrowRight,
  HeartPulse,
  LayoutDashboard,
  Leaf,
  Sparkles,
  User,
  Users,
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
  },
  {
    title: "Track Health",
    description: "Log symptoms, monitor vitals, and view AI health insights.",
    to: "/health",
    icon: HeartPulse,
    color: "text-health-teal",
  },
  {
    title: "Manage Food",
    description: "Plan meals, calories, macros, and hydration targets.",
    to: "/food",
    icon: Leaf,
    color: "text-health-rose",
  },
  {
    title: "Check AQI",
    description: "Monitor local air quality and breathing safety tips.",
    to: "/aqi",
    icon: AirVent,
    color: "text-health-cyan",
  },
  {
    title: "Community",
    description: "Connect with people on similar health journeys.",
    to: "/community",
    icon: Users,
    color: "text-health-violet",
  },
  {
    title: "Profile Settings",
    description: "Update your goals, account details, and preferences.",
    to: "/profile",
    icon: User,
    color: "text-health-indigo",
  },
];

const UserHome = () => {
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Welcome Back"
      subtitle="Today is a great day to stay on track. Pick what you want to focus on and continue your health journey."
    >
      <section className="rounded-2xl p-6 glass-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-health-teal/10 px-3 py-1 text-xs font-semibold text-health-teal">
              <Sparkles className="h-3.5 w-3.5" />
              Today Focus
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Complete 3 healthy actions today</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              1. Drink water 2.5L 2. Complete 30 min walk 3. Log all meals.
            </p>
          </div>
          <Button
            type="button"
            className="border-0 gradient-bg-primary text-primary-foreground"
            onClick={() => navigate("/dashboard")}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="group rounded-2xl p-5 glass-card hover-lift"
          >
            <div className="mb-4 flex items-center justify-between">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate(card.to)}
            >
              Go to {card.title.split(" ")[0]}
            </Button>
          </motion.article>
        ))}
      </section>
    </AppLayout>
  );
};

export default UserHome;
