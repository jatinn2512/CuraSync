import { motion } from "framer-motion";
import {
  Activity,
  Flame,
  Footprints,
  HeartPulse,
  Moon,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Wind,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";

const stats = [
  { label: "Steps", value: "8,432", target: "10,000", icon: Footprints, color: "text-health-teal", bg: "bg-health-teal/12", percent: 84 },
  { label: "Calories", value: "1,845", target: "2,200", icon: Flame, color: "text-health-rose", bg: "bg-health-rose/12", percent: 84 },
  { label: "Sleep", value: "7.2h", target: "8h", icon: Moon, color: "text-health-indigo", bg: "bg-health-indigo/12", percent: 90 },
  { label: "Heart Rate", value: "72", target: "bpm", icon: HeartPulse, color: "text-health-cyan", bg: "bg-health-cyan/12", percent: 100 },
] as const;

const weeklyData = [
  { day: "Mon", steps: 6200 },
  { day: "Tue", steps: 8400 },
  { day: "Wed", steps: 7100 },
  { day: "Thu", steps: 9200 },
  { day: "Fri", steps: 8432 },
  { day: "Sat", steps: 5600 },
  { day: "Sun", steps: 3200 },
] as const;

const insights = [
  { text: "Your sleep quality improved 12% this week. Keep maintaining your bedtime routine.", type: "positive" },
  { text: "Water intake is below target. Add two more glasses before evening.", type: "warning" },
  { text: "Great consistency: you hit your step goal on 4 out of the last 7 days.", type: "positive" },
] as const;

const quickActions = [
  { label: "Log Symptoms", icon: Stethoscope, path: "/health" },
  { label: "Add Meal", icon: UtensilsCrossed, path: "/food" },
  { label: "Check AQI", icon: Wind, path: "/aqi" },
] as const;

const Dashboard = () => {
  const navigate = useNavigate();
  const maxSteps = Math.max(...weeklyData.map((row) => row.steps));

  return (
    <AppLayout title="Dashboard" subtitle="Here's your health overview for today.">
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="glass-card rounded-3xl border-border/50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{stat.target}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percent}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border-border/50 p-6 xl:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Activity</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-health-teal/12 px-3 py-1 text-xs font-semibold text-health-teal">
              <Activity className="h-3.5 w-3.5" />
              Active Trend
            </span>
          </div>

          <div className="h-56 rounded-2xl border border-border/60 bg-card/55 p-4">
            <div className="flex h-full items-end gap-3">
              {weeklyData.map((row) => (
                <div key={row.day} className="flex h-full flex-1 flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.round((row.steps / maxSteps) * 100)}%` }}
                    transition={{ duration: 0.7 }}
                    className="min-h-5 rounded-t-lg bg-health-teal/85"
                  />
                  <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">{row.day}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-3xl border-border/50 p-6"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-health-violet" />
            AI Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.text}
                className={`rounded-2xl p-3 text-sm leading-relaxed ${
                  insight.type === "positive"
                    ? "bg-health-teal/10 text-health-teal"
                    : "bg-health-rose/10 text-health-rose"
                }`}
              >
                {insight.text}
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 + 0.12 }}>
              <Button
                type="button"
                variant="outline"
                className="h-20 w-full flex-col gap-2 rounded-2xl border-border/60 bg-card/65"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
