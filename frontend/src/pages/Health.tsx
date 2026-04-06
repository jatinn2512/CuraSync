import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Download,
  Footprints,
  HeartPulse,
  Moon,
  Plus,
  Send,
  Sparkles,
  Stethoscope,
  Wind,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import { getAccessToken, getApiBaseUrl } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";

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

type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

type ExerciseTask = {
  id: string;
  title: string;
  detail: string;
  completed: boolean;
};

type ExportScope = "complete" | "weekly" | "this_month";

type RiskOverview = {
  sleep: { duration_minutes?: number | null; quality_score?: number | null; sleep_date?: string | null } | null;
  activity: { steps?: number | null; workout_minutes?: number | null } | null;
  vitals: { heart_rate?: number | null; systolic_bp?: number | null } | null;
  food:
    | {
        latest_item?: string | null;
        latest_logged_at?: string | null;
        latest_calories?: number | null;
        latest_sodium_mg?: number | null;
        latest_note?: string | null;
        latest_alert?: string | null;
        latest_dish_name?: string | null;
        latest_restaurant_name?: string | null;
        latest_choice_at?: string | null;
        alert_counts?: { green?: number; yellow?: number; red?: number } | null;
        recent_choices?: number | null;
      }
    | null;
};

type HealthRiskApiResponse = {
  overall_risk: RiskLevel;
  conditions: {
    diabetes: { level: RiskLevel; probability: number; reasons: string[] };
    heart: { level: RiskLevel; probability: number; reasons: string[] };
    hypertension: { level: RiskLevel; score: number; reasons: string[] };
    obesity: { level: RiskLevel; bmi: number };
    aqi_risk: { level: RiskLevel; aqi: number; advice: string };
  };
};

const buildPlaceholderConditionRisks = (): ConditionRisk[] => [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: CheckCircle2,
    level: "Low",
    probability: 0.2,
    summary: "Not enough user data yet for personalized diabetes risk.",
    reasons: ["Add glucose, meal, and vitals logs to generate a data-backed estimate."],
    last30Days: ["No personal diabetes-relevant logs available yet."],
    recommendations: ["Log meals and vitals for at least a few days to unlock personalized insights."],
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: AlertTriangle,
    level: "Low",
    probability: 0.2,
    summary: "Not enough user data yet for personalized blood pressure risk.",
    reasons: ["Add BP and activity logs to calculate real hypertension trend."],
    last30Days: ["No BP/activity trend available for this account yet."],
    recommendations: ["Start logging BP and daily activity."],
  },
  {
    id: "heart",
    name: "Heart Disease",
    icon: HeartPulse,
    level: "Low",
    probability: 0.2,
    summary: "Not enough user data yet for personalized heart risk.",
    reasons: ["Add resting pulse, BP, and activity data for a better estimate."],
    last30Days: ["No personalized heart trend available yet."],
    recommendations: ["Track resting pulse and workout minutes regularly."],
  },
  {
    id: "obesity",
    name: "Obesity",
    icon: XCircle,
    level: "Low",
    probability: 0.2,
    summary: "Not enough body profile data yet for BMI-based risk.",
    reasons: ["Height/weight profile is needed for reliable obesity risk."],
    last30Days: ["BMI trend unavailable for this account yet."],
    recommendations: ["Update height and weight in Profile."],
  },
  {
    id: "aqi",
    name: "Asthma",
    icon: Wind,
    level: "Low",
    probability: 0.2,
    summary: "Not enough environment exposure data yet for asthma-risk signal.",
    reasons: ["AQI snapshots help estimate respiratory exposure risk."],
    last30Days: ["No AQI exposure trend available yet."],
    recommendations: ["Enable AQI tracking and keep location access on."],
  },
];

const normalizeActivity = (value: string | undefined): "low" | "moderate" | "high" => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized.includes("low")) return "low";
  if (normalized.includes("high")) return "high";
  return "moderate";
};

const levelToProbability = (level: RiskLevel): number => {
  if (level === "High") return 0.8;
  if (level === "Medium") return 0.55;
  return 0.25;
};

const buildRiskPayload = (
  age: number | undefined,
  gender: string | null | undefined,
  profile: { height_cm?: number | null; weight_kg?: number | null; activity_level?: string | null } | null | undefined,
  overview: RiskOverview | null,
) => {
  const heightCm = profile?.height_cm ?? null;
  const weightKg = profile?.weight_kg ?? null;
  const bmi = heightCm && weightKg ? weightKg / ((heightCm / 100) * (heightCm / 100)) : 24;
  const latestFoodSodium = overview?.food?.latest_sodium_mg ?? 0;
  const sodiumBpBoost = latestFoodSodium >= 1200 ? 10 : latestFoodSodium >= 800 ? 5 : 0;
  const systolic = (overview?.vitals?.systolic_bp ?? 120) + sodiumBpBoost;
  const heartRate = overview?.vitals?.heart_rate ?? 150;
  const steps = overview?.activity?.steps ?? 0;
  const latestFoodAlert = (overview?.food?.latest_alert ?? "").trim().toLowerCase();
  let stress: "low" | "medium" | "high" = steps < 4000 ? "high" : steps < 8000 ? "medium" : "low";
  if (latestFoodAlert === "red") {
    stress = "high";
  } else if (latestFoodAlert === "yellow" && stress === "low") {
    stress = "medium";
  }
  const sex = (gender ?? "").toLowerCase().startsWith("m") ? 1 : 0;

  return {
    age: age ?? 30,
    sex,
    glucose: 110,
    bmi: Number(bmi.toFixed(2)),
    bp: systolic,
    insulin: 80,
    pregnancies: 0,
    skin_thickness: 20,
    dpf: 0.5,
    chol: 190,
    fbs: 0,
    thalach: heartRate,
    cp: 0,
    activity: normalizeActivity(profile?.activity_level ?? undefined),
    stress,
    aqi: 140,
  };
};

const buildConditionRisksFromApi = (risk: HealthRiskApiResponse, overview: RiskOverview | null): ConditionRisk[] => {
  const sleepSummary = overview?.sleep
    ? `Latest sleep: ${overview.sleep.duration_minutes ?? "N/A"} min, quality ${overview.sleep.quality_score ?? "N/A"}`
    : "Sleep logs not available yet.";
  const activitySummary = overview?.activity
    ? `Latest activity: ${overview.activity.steps ?? 0} steps, ${overview.activity.workout_minutes ?? 0} workout mins`
    : "Activity logs not available yet.";
  const vitalsSummary = overview?.vitals
    ? `Latest vitals: HR ${overview.vitals.heart_rate ?? "N/A"}, BP ${overview.vitals.systolic_bp ?? "N/A"}`
    : "Vitals logs not available yet.";
  const foodSummary = overview?.food?.latest_item
    ? `Latest food: ${overview.food.latest_item} (${overview.food.latest_alert ?? "N/A"} alert)`
    : "No restaurant food analysis logged yet.";

  return [
    {
      id: "diabetes",
      name: "Diabetes",
      icon: CheckCircle2,
      level: risk.conditions.diabetes.level,
      probability: risk.conditions.diabetes.probability,
      summary: risk.conditions.diabetes.reasons[0] || "Model-based diabetes estimate generated.",
      reasons: risk.conditions.diabetes.reasons.length ? risk.conditions.diabetes.reasons : ["No major diabetes markers detected."],
      last30Days: [sleepSummary, activitySummary, foodSummary],
      recommendations: ["Reduce added sugar intake.", "Keep post-meal walk habit.", "Log fasting sugar regularly."],
    },
    {
      id: "hypertension",
      name: "Hypertension",
      icon: AlertTriangle,
      level: risk.conditions.hypertension.level,
      probability: Math.min(Math.max(risk.conditions.hypertension.score / 10, 0), 1),
      summary: risk.conditions.hypertension.reasons[0] || "Rule-based hypertension score generated.",
      reasons: risk.conditions.hypertension.reasons.length
        ? risk.conditions.hypertension.reasons
        : ["No major hypertension markers detected."],
      last30Days: [vitalsSummary, activitySummary, foodSummary],
      recommendations: ["Track BP at fixed time daily.", "Lower sodium intake.", "Add stress management routine."],
    },
    {
      id: "heart",
      name: "Heart Disease",
      icon: HeartPulse,
      level: risk.conditions.heart.level,
      probability: risk.conditions.heart.probability,
      summary: risk.conditions.heart.reasons[0] || "Model-based heart-risk estimate generated.",
      reasons: risk.conditions.heart.reasons.length ? risk.conditions.heart.reasons : ["No major heart markers detected."],
      last30Days: [vitalsSummary, activitySummary, foodSummary],
      recommendations: ["Maintain regular cardio.", "Keep BP and pulse monitoring active.", "Avoid prolonged inactivity."],
    },
    {
      id: "obesity",
      name: "Obesity",
      icon: XCircle,
      level: risk.conditions.obesity.level,
      probability: levelToProbability(risk.conditions.obesity.level),
      summary: `BMI based assessment: ${risk.conditions.obesity.bmi}`,
      reasons: ["BMI-based risk score was used."],
      last30Days: [activitySummary, sleepSummary, foodSummary],
      recommendations: ["Maintain calorie balance.", "Keep protein-focused meals.", "Track body weight weekly."],
    },
    {
      id: "aqi",
      name: "Asthma",
      icon: Wind,
      level: risk.conditions.aqi_risk.level,
      probability: levelToProbability(risk.conditions.aqi_risk.level),
      summary: `AQI risk level: ${risk.conditions.aqi_risk.level}`,
      reasons: [risk.conditions.aqi_risk.advice],
      last30Days: ["Respiratory exposure risk uses AQI trend + overall risk.", vitalsSummary, foodSummary],
      recommendations: ["Use mask on poor AQI days.", "Prefer indoor workouts on high AQI.", "Check AQI before commute."],
    },
  ];
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

const buildExercisePlan = (hour: number): ExerciseTask[] => {
  if (hour >= 5 && hour < 12) {
    return [
      { id: "walk", title: "20 min brisk walk", detail: "Wake-up mobility and light cardio.", completed: false },
      { id: "stretch", title: "10 min stretching", detail: "Neck, back, and hamstring mobility.", completed: false },
      { id: "breath", title: "8 min breathing", detail: "Calm breathing before work.", completed: false },
    ];
  }
  if (hour >= 12 && hour < 18) {
    return [
      { id: "run", title: "25 min run", detail: "Moderate pace cardio session.", completed: false },
      { id: "core", title: "15 min core", detail: "Plank and bodyweight core set.", completed: false },
      { id: "meditation", title: "30 min meditation", detail: "Recovery + stress control.", completed: false },
    ];
  }
  return [
    { id: "walk_evening", title: "20 min evening walk", detail: "Light recovery and digestion support.", completed: false },
    { id: "yoga", title: "15 min yoga flow", detail: "Easy movement before sleep.", completed: false },
    { id: "meditation_night", title: "30 min meditation", detail: "Wind down and improve sleep quality.", completed: false },
  ];
};

const Health = () => {
  const navigate = useNavigate();
  const [planHour, setPlanHour] = useState<number>(() => new Date().getHours());
  const [symptom, setSymptom] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState("");
  const [exportScope, setExportScope] = useState<ExportScope>("complete");
  const [conditionRisks, setConditionRisks] = useState<ConditionRisk[]>(() => buildPlaceholderConditionRisks());
  const [riskInfoMessage, setRiskInfoMessage] = useState("Add your health logs to generate personalized risk alerts.");
  const [isRiskLoading, setIsRiskLoading] = useState(true);
  const [riskOverview, setRiskOverview] = useState<RiskOverview | null>(null);
  const [exercisePlan, setExercisePlan] = useState<ExerciseTask[]>(() => buildExercisePlan(new Date().getHours()));
  const [customExercise, setCustomExercise] = useState("");
  const [customExerciseLogs, setCustomExerciseLogs] = useState<ExerciseTask[]>([]);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi, I am your AI health assistant. Describe your symptoms and I will share initial guidance. This is not a substitute for medical diagnosis.",
    },
  ]);

  const selectedRisk = conditionRisks.find((risk) => risk.id === selectedRiskId) ?? null;
  const foodOverview = riskOverview?.food ?? null;

  const maxHeartRate = Math.max(...trendData.map((point) => point.heartRate));
  const maxSteps = Math.max(...trendData.map((point) => point.steps));

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentHour = new Date().getHours();
      setPlanHour((prev) => (prev === currentHour ? prev : currentHour));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setExercisePlan(buildExercisePlan(planHour));
  }, [planHour]);

  useEffect(() => {
    let cancelled = false;

    const loadConditionRisks = async () => {
      setIsRiskLoading(true);
      setRiskInfoMessage("Loading personalized risk alerts...");

      const [userResponse, overviewResponse] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.get<RiskOverview>("/risk/overview"),
      ]);

      if (cancelled) return;

      const user = userResponse.data;
      const overview = overviewResponse.data ?? null;
      setRiskOverview(overview);
      const hasVitals = Boolean(overview?.vitals && (overview.vitals.systolic_bp ?? overview.vitals.heart_rate));
      const hasActivity = Boolean(overview?.activity && ((overview.activity.steps ?? 0) > 0 || (overview.activity.workout_minutes ?? 0) > 0));
      const hasBodyProfile = Boolean(user?.profile?.height_cm && user?.profile?.weight_kg);
      const hasFood = Boolean((overview?.food?.recent_choices ?? 0) > 0 || overview?.food?.latest_item);

      if (!user || (!hasVitals && !hasActivity && !hasBodyProfile && !hasFood)) {
        setConditionRisks(buildPlaceholderConditionRisks());
        setRiskInfoMessage("No personal health logs found yet. Add vitals/activity/profile data for personalized risk.");
        setIsRiskLoading(false);
        return;
      }

      const riskPayload = buildRiskPayload(user.age, user.gender, user.profile, overview);
      const riskResponse = await apiClient.post<HealthRiskApiResponse>("/health/risk", riskPayload);
      if (cancelled) return;

      if (riskResponse.data) {
        setConditionRisks(buildConditionRisksFromApi(riskResponse.data, overview));
        setRiskInfoMessage("Personalized risk generated from your current profile and latest logs.");
      } else {
        setConditionRisks(buildPlaceholderConditionRisks());
        setRiskInfoMessage("Risk engine could not read your data right now. Showing starter guidance.");
      }
      setIsRiskLoading(false);
    };

    void loadConditionRisks();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleExportPdf = async () => {
    setExportError("");
    setExportSuccess("");
    setIsExporting(true);

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const response = await fetch(`${getApiBaseUrl()}/auth/export/pdf?scope=${encodeURIComponent(exportScope)}`, {
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

      const scopeLabel = exportScope === "weekly" ? "weekly" : exportScope === "this_month" ? "this month" : "complete";
      setExportSuccess(`User ${scopeLabel} health data exported successfully as PDF.`);
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

  const toggleExerciseCompleted = (taskId: string) => {
    setExercisePlan((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  const addCustomExercise = () => {
    const title = customExercise.trim();
    if (!title) return;

    setCustomExerciseLogs((prev) => [
      {
        id: `custom-${Date.now()}`,
        title,
        detail: "Logged by you",
        completed: false,
      },
      ...prev,
    ]);
    setCustomExercise("");
  };

  const addGymTemplate = (label: string) => {
    setCustomExerciseLogs((prev) => [
      {
        id: `gym-${label.toLowerCase()}-${Date.now()}`,
        title: `Gym: ${label}`,
        detail: "Strength training session logged.",
        completed: false,
      },
      ...prev,
    ]);
  };

  const toggleCustomExerciseCompleted = (taskId: string) => {
    setCustomExerciseLogs((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  return (
    <AppLayout title="Health" subtitle="Monitor vitals, track symptoms, and get AI-backed recommendations.">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl border-border/50 p-3 sm:rounded-3xl sm:p-5"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card sm:h-10 sm:w-10 sm:rounded-xl">
                <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-base font-bold sm:text-lg">{metric.value}</p>
                <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">{metric.label}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="flex justify-end">
        <Button type="button" className="h-10 rounded-xl bg-primary px-4 text-primary-foreground" onClick={() => navigate("/analysis")}>
          Deep Analysis
        </Button>
      </section>

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Export Your Data</h2>
            <p className="text-sm text-muted-foreground">Download complete, weekly, or this month health data in PDF format.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="inline-flex rounded-xl border border-border/60 bg-card/60 p-1">
              {[
                { key: "complete", label: "Complete" },
                { key: "weekly", label: "Weekly" },
                { key: "this_month", label: "This Month" },
              ].map((option) => (
                <Button
                  key={option.key}
                  type="button"
                  variant={exportScope === option.key ? "default" : "ghost"}
                  className="h-8 rounded-lg px-3 text-xs"
                  onClick={() => setExportScope(option.key as ExportScope)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              className="h-10 rounded-xl bg-primary px-4 text-primary-foreground"
              onClick={handleExportPdf}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>
        {exportError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">{exportError}</div>
        )}
        {exportSuccess && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">{exportSuccess}</div>
        )}
      </section>

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Food Analysis</h2>
        {foodOverview?.latest_item ? (
          <div className="rounded-2xl border border-border/60 bg-card/55 p-4 text-sm">
            <p className="font-semibold">{foodOverview.latest_item}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Alert {foodOverview.latest_alert ?? "N/A"} | Total confirmed {foodOverview.recent_choices ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Green {foodOverview.alert_counts?.green ?? 0} | Yellow {foodOverview.alert_counts?.yellow ?? 0} | Red{" "}
              {foodOverview.alert_counts?.red ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Detailed nutrition + history is available in Food &gt; History.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/45 p-4 text-sm text-muted-foreground">
            No confirmed restaurant dishes yet. Confirm a dish in Food page to start food analysis tracking.
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[340px,1fr]">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Disease Risk Alerts
          </h2>
          <p className="mb-3 text-xs text-muted-foreground">{isRiskLoading ? "Preparing personalized risk..." : riskInfoMessage}</p>
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

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-health-violet" />
          Exercise Plan
        </h2>
        <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            value={customExercise}
            onChange={(event) => setCustomExercise(event.target.value)}
            placeholder="Add your own exercise log (e.g., 40 min cycling)"
            className="h-10 rounded-xl border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
          />
          <Button type="button" className="h-10 rounded-xl px-4 text-xs" onClick={addCustomExercise}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map((group) => (
            <Button key={group} type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={() => addGymTemplate(group)}>
              <Dumbbell className="h-3.5 w-3.5" />
              {group}
            </Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {exercisePlan.map((task) => (
            <div key={task.id} className="rounded-2xl border border-border/60 bg-card/55 p-4">
              <p className="text-sm font-semibold">{task.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{task.detail}</p>
              <div className="mt-3">
                <Button
                  type="button"
                  variant={task.completed ? "outline" : "default"}
                  className={`h-8 rounded-lg px-3 text-xs ${task.completed ? "border-emerald-500/40 text-emerald-600" : ""}`}
                  onClick={() => toggleExerciseCompleted(task.id)}
                >
                  {task.completed ? "Completed" : "Complete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {customExerciseLogs.length ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your exercise logs</p>
            {customExerciseLogs.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/55 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.detail}</p>
                </div>
                <Button
                  type="button"
                  variant={task.completed ? "outline" : "default"}
                  className={`h-8 rounded-lg px-3 text-xs ${task.completed ? "border-emerald-500/40 text-emerald-600" : ""}`}
                  onClick={() => toggleCustomExerciseCompleted(task.id)}
                >
                  {task.completed ? "Completed" : "Complete"}
                </Button>
              </div>
            ))}
          </div>
        ) : null}
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
