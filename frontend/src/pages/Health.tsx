import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Footprints, HeartPulse, Moon, Send, Sparkles, Stethoscope } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";

const trendData = [
  { date: "Mon", heartRate: 72, steps: 6200 },
  { date: "Tue", heartRate: 75, steps: 8400 },
  { date: "Wed", heartRate: 70, steps: 7100 },
  { date: "Thu", heartRate: 68, steps: 9200 },
  { date: "Fri", heartRate: 72, steps: 8432 },
] as const;

const metrics = [
  { label: "Heart Rate", value: "72 bpm", icon: HeartPulse, color: "text-health-rose", bg: "bg-health-rose/12" },
  { label: "Blood Pressure", value: "120/80", icon: Activity, color: "text-health-cyan", bg: "bg-health-cyan/12" },
  { label: "Sleep Score", value: "85/100", icon: Moon, color: "text-health-indigo", bg: "bg-health-indigo/12" },
  { label: "Steps Today", value: "8,432", icon: Footprints, color: "text-health-teal", bg: "bg-health-teal/12" },
] as const;

type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

const Health = () => {
  const [symptom, setSymptom] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi, I am your AI health assistant. Describe your symptoms and I will share initial guidance. This is not a substitute for medical diagnosis.",
    },
  ]);

  const maxHeartRate = Math.max(...trendData.map((point) => point.heartRate));
  const maxSteps = Math.max(...trendData.map((point) => point.steps));

  const handleSubmit = () => {
    if (!symptom.trim()) return;

    const userText = symptom.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      {
        role: "ai",
        text: `Based on "${userText}", monitor symptoms for 24-48 hours, maintain hydration, and rest well. Consult a healthcare professional if symptoms persist or worsen.`,
      },
    ]);
    setSymptom("");
  };

  return (
    <AppLayout title="Health" subtitle="Monitor vitals, track symptoms, and get AI-backed recommendations.">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-3xl border-border/50 p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Stethoscope className="h-5 w-5 text-primary" />
            Symptom Checker
          </h2>

          <div className="mb-4 h-60 space-y-3 overflow-y-auto rounded-2xl border border-border/60 bg-card/45 p-3 sm:h-72">
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-3 text-sm leading-relaxed ${
                  message.role === "ai" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground ml-8"
                }`}
              >
                {message.text}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={symptom}
              onChange={(event) => setSymptom(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
              placeholder="Describe your symptoms"
              className="h-11 flex-1 rounded-xl border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
            />
            <Button type="button" size="icon" className="h-11 w-11 rounded-xl bg-primary text-primary-foreground" onClick={handleSubmit}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="glass-card rounded-3xl border-border/50 p-6"
        >
          <h2 className="mb-4 text-xl font-semibold">Health Trends</h2>
          <div className="rounded-2xl border border-border/60 bg-card/45 p-4">
            <div className="grid h-72 grid-cols-5 items-end gap-3">
              {trendData.map((point) => (
                <div key={point.date} className="flex h-full flex-col justify-end gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.round((point.heartRate / maxHeartRate) * 40)}%` }}
                    transition={{ duration: 0.6 }}
                    className="rounded-t-md bg-health-rose/85"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.round((point.steps / maxSteps) * 58)}%` }}
                    transition={{ duration: 0.7 }}
                    className="rounded-t-md bg-health-teal/85"
                  />
                  <p className="text-center text-[11px] font-medium text-muted-foreground">{point.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-health-rose/90" />
                Heart rate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-health-teal/90" />
                Steps
              </span>
            </div>
          </div>
        </motion.article>
      </section>

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-health-violet" />
          AI Recommendations
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            "Limit screen usage one hour before sleep for better recovery.",
            "Your heart trend is stable. Continue current workout frequency.",
            "Increase iron-rich food this week for better daytime energy.",
          ].map((recommendation) => (
            <div key={recommendation} className="rounded-2xl border border-border/60 bg-card/55 p-4 text-sm leading-relaxed text-muted-foreground">
              {recommendation}
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Health;
