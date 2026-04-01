import { motion } from "framer-motion";
import { Activity, Brain, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const vitals = [
  { label: "Resting Heart Rate", value: "68 bpm", delta: "-2 this week", icon: HeartPulse },
  { label: "Blood Oxygen", value: "98%", delta: "Stable", icon: ShieldCheck },
  { label: "Stress Index", value: "24", delta: "Low", icon: Brain },
  { label: "Daily Activity", value: "8,420", delta: "+11%", icon: Activity },
];

const insights = [
  "Your sleep recovery is improving. Keep bedtime before 11:30 PM.",
  "Hydration is below target for 2 consecutive days. Add 2 more glasses.",
  "Cardio consistency is strong. Maintain 30 min sessions, 4 days a week.",
];

const Health = () => {
  return (
    <AppLayout
      title="Health"
      subtitle="Track your core health indicators and follow AI-backed recommendations based on your daily trends."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vitals.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <item.icon className="h-5 w-5 text-health-teal" />
            </div>
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.delta}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-health-indigo" />
            <h2 className="text-xl font-semibold">Symptom Check</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="mb-1 block text-sm text-muted-foreground">
                Tell us how you feel
              </label>
              <textarea
                id="symptoms"
                className="h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus:ring-2"
                placeholder="Example: mild headache, fatigue, sore throat since morning"
              />
            </div>
            <button
              type="button"
              className="rounded-xl gradient-bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Analyze Symptoms
            </button>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="mb-4 text-xl font-semibold">AI Health Insights</h2>
          <ul className="space-y-3">
            {insights.map((insight) => (
              <li key={insight} className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm leading-relaxed">
                {insight}
              </li>
            ))}
          </ul>
        </motion.article>
      </section>
    </AppLayout>
  );
};

export default Health;
