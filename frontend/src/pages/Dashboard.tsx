import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck,
  HeartPulse,
  TrendingUp,
  UtensilsCrossed,
  Wind,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

const stats = [
  {
    label: "Heart Health",
    value: "92%",
    detail: "Excellent",
    icon: HeartPulse,
    color: "text-health-rose",
  },
  {
    label: "Activity Score",
    value: "8.4k",
    detail: "Steps today",
    icon: Activity,
    color: "text-health-teal",
  },
  {
    label: "Nutrition",
    value: "1,840",
    detail: "Calories",
    icon: UtensilsCrossed,
    color: "text-health-indigo",
  },
  {
    label: "Air Quality",
    value: "48",
    detail: "AQI Moderate",
    icon: Wind,
    color: "text-health-cyan",
  },
];

const dashboardMetrics = [
  { label: "Hydration", pct: 76, color: "bg-health-cyan" },
  { label: "Sleep Quality", pct: 88, color: "bg-health-indigo" },
  { label: "Stress Balance", pct: 67, color: "bg-health-violet" },
  { label: "Weekly Fitness", pct: 81, color: "bg-health-teal" },
];

const tasks = [
  "Morning breathing session - 10 mins",
  "Log lunch nutrition",
  "Evening 30 min walk",
  "Medication reminder at 9:00 PM",
];

const Dashboard = () => {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Your complete health snapshot in one place. Track progress, monitor habits, and act on insights."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progress Overview</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-health-teal/10 px-3 py-1 text-xs font-semibold text-health-teal">
              <TrendingUp className="h-3.5 w-3.5" />
              Improving
            </span>
          </div>

          <div className="space-y-5">
            {dashboardMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium">{metric.pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.pct}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-health-indigo" />
            <h2 className="text-xl font-semibold">Today Plan</h2>
          </div>

          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task} className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm">
                {task}
              </li>
            ))}
          </ul>
        </motion.article>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
