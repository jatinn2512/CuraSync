import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  Footprints,
  HeartPulse,
  Moon,
  Send,
  Sparkles,
  Stethoscope,
  Wind,
  X,
  XCircle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import { getAccessToken, getApiBaseUrl } from "@/lib/auth";

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

type RiskLevel = "Low" | "Medium" | "High";

type ConditionRisk = {
  id: string;
  name: string;
  icon: LucideIcon;
  level: RiskLevel;
  probability: number;
  summary: string;
  reasons: string[];
  last30Days: string[];
  recommendations: string[];
};

const conditionRisks: ConditionRisk[] = [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: CheckCircle2,
    level: "Medium",
    probability: 0.58,
    summary: "Borderline sugar trend detected.",
    reasons: ["Fasting sugar stayed above target on 8 days", "Higher carb-heavy dinner pattern", "Lower weekday activity"],
    last30Days: ["Average sleep: 6.4h/night", "High-carb meals: 11", "Average steps: 6,980/day"],
    recommendations: ["Reduce added sugar in evening meals", "Walk 20 mins after dinner", "Track fasting sugar every 3 days"],
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: AlertTriangle,
    level: "High",
    probability: 0.76,
    summary: "BP variability needs attention.",
    reasons: ["Systolic readings above 140 on multiple days", "Sodium-heavy food choices this month", "Stress indicators elevated"],
    last30Days: ["Average sleep: 5.9h/night", "Salty restaurant meals: 9", "High BP entries: 7"],
    recommendations: ["Limit packaged salty snacks", "Practice 10-min breathing sessions", "Take BP reading at fixed time daily"],
  },
  {
    id: "heart",
    name: "Heart Disease",
    icon: HeartPulse,
    level: "Medium",
    probability: 0.51,
    summary: "Moderate cardio risk markers.",
    reasons: ["Inconsistent workout streak", "Higher resting pulse on low-sleep days", "Combined BP and activity pattern"],
    last30Days: ["Cardio sessions: 8", "Average resting pulse: 74 bpm", "Low-activity days: 13"],
    recommendations: ["Target 150 active mins/week", "Avoid late-night meals", "Maintain sleep schedule consistency"],
  },
  {
    id: "obesity",
    name: "Obesity",
    icon: XCircle,
    level: "Low",
    probability: 0.28,
    summary: "Weight trend mostly stable.",
    reasons: ["BMI is near healthy range", "Meal timing is fairly consistent", "Hydration trend is improving"],
    last30Days: ["Weight fluctuation: +0.4 kg", "Average sleep: 6.8h/night", "Average steps: 8,120/day"],
    recommendations: ["Maintain protein in breakfast", "Keep evening walk habit", "Continue current hydration pattern"],
  },
  {
    id: "aqi",
    name: "AQI Respiratory",
    icon: Wind,
    level: "High",
    probability: 0.72,
    summary: "Air exposure risk currently elevated.",
    reasons: ["AQI crossed 200 on several days", "Outdoor workouts during peak pollution", "Respiratory sensitivity profile flagged"],
    last30Days: ["High AQI days: 12", "Outdoor sessions on high AQI: 5", "Average mask compliance: 62%"],
    recommendations: ["Shift workouts to early indoor slots", "Use N95 on poor AQI days", "Enable AQI alerts before commute"],
  },
];

type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

const levelTextClass = (level: RiskLevel): string => {
  if (level === "Low") return "text-emerald-600";
  if (level === "Medium") return "text-amber-600";
  return "text-red-600";
};

const levelBadgeClass = (level: RiskLevel): string => {
  if (level === "Low") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
  if (level === "Medium") return "border-amber-500/30 bg-amber-500/10 text-amber-600";
  return "border-red-500/30 bg-red-500/10 text-red-600";
};

const levelIcon = (level: RiskLevel): LucideIcon => {
  if (level === "Low") return CheckCircle2;
  if (level === "Medium") return AlertTriangle;
  return XCircle;
};

const Health = () => {
  const [symptom, setSymptom] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState("");
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi, I am your AI health assistant. Describe your symptoms and I will share initial guidance. This is not a substitute for medical diagnosis.",
    },
  ]);

  const selectedRisk = conditionRisks.find((risk) => risk.id === selectedRiskId) ?? null;

  const maxHeartRate = Math.max(...trendData.map((point) => point.heartRate));
  const maxSteps = Math.max(...trendData.map((point) => point.steps));

  const handleExportPdf = async () => {
    setExportError("");
    setExportSuccess("");
    setIsExporting(true);

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const response = await fetch(`${getApiBaseUrl()}/auth/export/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Failed to export user data.";
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          try {
            const payload = (await response.json()) as { detail?: string };
            if (payload.detail) {
              message = payload.detail;
            }
          } catch {
            // Use fallback message when error response cannot be parsed.
          }
        }
        throw new Error(message);
      }

      const pdfBlob = await response.blob();
      const objectUrl = window.URL.createObjectURL(pdfBlob);

      const disposition = response.headers.get("content-disposition");
      const filenameMatch = disposition?.match(/filename=\"?([^\";]+)\"?/i);
      const fileName = filenameMatch?.[1] || "curasync-user-data.pdf";

      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(objectUrl);

      setExportSuccess("User data exported successfully as PDF.");
      setTimeout(() => setExportSuccess(""), 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setExportError(error.message);
      } else {
        setExportError("Failed to export user data.");
      }
    } finally {
      setIsExporting(false);
    }
  };

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card">
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

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Export Your Data</h2>
            <p className="text-sm text-muted-foreground">Download all available user data in PDF format.</p>
          </div>
          <Button
            type="button"
            className="h-10 rounded-xl bg-primary px-4 text-primary-foreground"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export All Data (PDF)"}
          </Button>
        </div>
        {exportError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">{exportError}</div>
        )}
        {exportSuccess && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">{exportSuccess}</div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[340px,1fr]">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Disease Risk Alerts
          </h2>
          <div className="space-y-3">
            {conditionRisks.map((risk) => (
              <button
                key={risk.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3 text-left transition-colors hover:border-primary/50"
                onClick={() => setSelectedRiskId(risk.id)}
              >
                <span>
                  <span className="block text-sm font-semibold">{risk.name}</span>
                  <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${levelBadgeClass(risk.level)}`}>
                    {risk.level}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </article>

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
                  message.role === "ai" ? "bg-muted text-foreground" : "ml-8 bg-primary text-primary-foreground"
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
      </section>

      <motion.section
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
      </motion.section>

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

      <AnimatePresence>
        {selectedRisk ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            onClick={() => setSelectedRiskId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-border/60 bg-background p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedRisk.name} Risk Overview</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Risk based on current profile trends and recent behavior signals.</p>
                </div>
                <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setSelectedRiskId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${levelBadgeClass(selectedRisk.level)}`}>
                  {selectedRisk.level} Risk
                </span>
                <span className="text-sm text-muted-foreground">Estimated probability: {(selectedRisk.probability * 100).toFixed(0)}%</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card/55 p-4">
                  <p className="mb-2 text-sm font-semibold">Why this alert</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {selectedRisk.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <span className={levelTextClass(selectedRisk.level)}>•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/55 p-4">
                  <p className="mb-2 text-sm font-semibold">Last 30 days snapshot</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {selectedRisk.last30Days.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-card/55 p-4">
                <p className="mb-2 text-sm font-semibold">Suggested next actions</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedRisk.recommendations.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-0.5">
                        {(() => {
                          const Icon = levelIcon(selectedRisk.level);
                          return <Icon className={`h-3.5 w-3.5 ${levelTextClass(selectedRisk.level)}`} />;
                        })()}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Health;
