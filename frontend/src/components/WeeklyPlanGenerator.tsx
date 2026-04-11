import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCcw, Target } from "lucide-react";
import { Button } from "@/components/Button";

type RiskLevel = "Low" | "Medium" | "High";

type PlanRisk = {
  id: string;
  name: string;
  level: RiskLevel;
};

type WeeklyPlanGeneratorProps = {
  conditionRisks: PlanRisk[];
};

type WeeklyPlanRow = {
  dayLabel: string;
  dateLabel: string;
  focusName: string;
  food: string;
  activity: string;
  check: string;
  caution: string;
};

type FocusTemplate = {
  food: string[];
  activity: string[];
  check: string[];
  caution: string[];
};

const focusTemplates: Record<string, FocusTemplate> = {
  diabetes: {
    food: [
      "Low-GI breakfast with protein and fiber.",
      "Keep lunch carb portion controlled and add salad.",
      "Avoid sweet drinks and late-night dessert.",
    ],
    activity: [
      "20-minute brisk walk after one major meal.",
      "Light bodyweight routine for 15 minutes.",
      "10-minute post-dinner walk to reduce sugar spikes.",
    ],
    check: [
      "Check fasting sugar in the morning.",
      "Track meal timing consistency for the day.",
      "Review sugar cravings before sleep.",
    ],
    caution: [
      "Do not skip meals after long fasting windows.",
      "Avoid high-sugar snacking between meetings.",
      "Watch portion size for rice, bread, and sweets.",
    ],
  },
  hypertension: {
    food: [
      "Keep sodium low and avoid packaged salty snacks.",
      "Choose potassium-rich food like banana or spinach.",
      "Use less pickle, sauces, and added table salt.",
    ],
    activity: [
      "30-minute moderate walk or cycling.",
      "15-minute breathing and mobility block.",
      "Short stretch break every 90 minutes.",
    ],
    check: [
      "Measure BP at a consistent time.",
      "Log stress level after work hours.",
      "Track hydration during the day.",
    ],
    caution: [
      "Avoid excess caffeine in late evening.",
      "Do not stack intense activity on poor sleep days.",
      "Limit highly processed foods today.",
    ],
  },
  heart: {
    food: [
      "Prefer grilled or steamed meals over fried.",
      "Add a heart-friendly fat source in controlled quantity.",
      "Keep dinner lighter than lunch.",
    ],
    activity: [
      "25-minute cardio in easy-to-moderate zone.",
      "10-minute warm-up and cool-down.",
      "Avoid sudden high-intensity spikes today.",
    ],
    check: [
      "Track resting pulse after waking.",
      "Review activity minutes by evening.",
      "Note unusual fatigue or breathlessness.",
    ],
    caution: [
      "Avoid smoking and second-hand smoke exposure.",
      "Keep stress triggers low in late hours.",
      "Do not ignore chest discomfort symptoms.",
    ],
  },
  obesity: {
    food: [
      "Use plate method: half veggies, quarter protein.",
      "Choose high-satiety snacks (fruit, yogurt, nuts).",
      "Avoid liquid calories and heavy late dinner.",
    ],
    activity: [
      "40-minute total movement across the day.",
      "Add one short strength circuit.",
      "Take a 5-minute walk after long sitting blocks.",
    ],
    check: [
      "Track total steps before bedtime.",
      "Log hunger level before major meals.",
      "Review calorie-dense foods consumed today.",
    ],
    caution: [
      "Avoid binge-prone screen-time snacking.",
      "Do not skip protein in main meals.",
      "Keep sleep schedule consistent tonight.",
    ],
  },
  aqi: {
    food: [
      "Add vitamin C rich food and enough fluids.",
      "Prefer warm, light meals on poor AQI days.",
      "Avoid deep-fried heavy foods before commute.",
    ],
    activity: [
      "Shift workout to indoor setting.",
      "Use low-intensity mobility if AQI remains poor.",
      "Keep outdoor exposure windows short.",
    ],
    check: [
      "Review AQI before leaving home.",
      "Log any cough or breathing discomfort.",
      "Track mask usage during commute.",
    ],
    caution: [
      "Avoid outdoor cardio during peak traffic hours.",
      "Use protective mask in poor air areas.",
      "Pause activity if breathlessness increases.",
    ],
  },
  default: {
    food: [
      "Build balanced plate with protein, fiber, and healthy fats.",
      "Keep hydration steady through the day.",
      "Avoid heavy ultra-processed food choices.",
    ],
    activity: [
      "Hit at least 30 minutes of movement.",
      "Take standing or walking breaks each hour.",
      "End the day with light stretching.",
    ],
    check: [
      "Log sleep quality and energy level.",
      "Review daily steps and active minutes.",
      "Record one behavior to improve tomorrow.",
    ],
    caution: [
      "Do not overtrain after poor sleep.",
      "Avoid late-night heavy meals.",
      "Reduce prolonged sedentary periods.",
    ],
  },
};

const scoreByLevel: Record<RiskLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const getOverallRiskLevel = (risks: PlanRisk[]): RiskLevel => {
  let best: RiskLevel = "Low";
  for (const risk of risks) {
    if (scoreByLevel[risk.level] > scoreByLevel[best]) {
      best = risk.level;
    }
  }
  return best;
};

const buildWeeklyPlan = (focusRisks: PlanRisk[]): WeeklyPlanRow[] => {
  const baseDate = new Date();
  const formatterDay = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const formatterDate = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" });

  const focusPool = focusRisks.length
    ? focusRisks
    : [
        {
          id: "default",
          name: "General Health",
          level: "Medium" as RiskLevel,
        },
      ];

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + index);

    const focus = focusPool[index % focusPool.length];
    const template = focusTemplates[focus.id] ?? focusTemplates.default;

    return {
      dayLabel: formatterDay.format(currentDate),
      dateLabel: formatterDate.format(currentDate),
      focusName: focus.name,
      food: template.food[index % template.food.length],
      activity: template.activity[index % template.activity.length],
      check: template.check[index % template.check.length],
      caution: template.caution[index % template.caution.length],
    };
  });
};

const WeeklyPlanGenerator = ({ conditionRisks }: WeeklyPlanGeneratorProps) => {
  const rankedRisks = useMemo(
    () =>
      [...conditionRisks].sort(
        (left, right) => scoreByLevel[right.level] - scoreByLevel[left.level] || left.name.localeCompare(right.name),
      ),
    [conditionRisks],
  );

  const autoFocusRisks = useMemo(() => {
    const highPriority = rankedRisks.filter((risk) => risk.level === "High").slice(0, 2);
    if (highPriority.length) return highPriority;
    return rankedRisks.slice(0, 2);
  }, [rankedRisks]);

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedFocusIds, setSelectedFocusIds] = useState<string[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [planRows, setPlanRows] = useState<WeeklyPlanRow[]>([]);

  useEffect(() => {
    setSelectedFocusIds((previous) => {
      const availableIds = new Set(rankedRisks.map((risk) => risk.id));
      const valid = previous.filter((id) => availableIds.has(id));
      if (valid.length) return valid.slice(0, 2);
      return autoFocusRisks.map((risk) => risk.id).slice(0, 2);
    });
  }, [autoFocusRisks, rankedRisks]);

  const manualFocusRisks = useMemo(() => {
    const selected = rankedRisks.filter((risk) => selectedFocusIds.includes(risk.id));
    return selected.length ? selected : autoFocusRisks;
  }, [autoFocusRisks, rankedRisks, selectedFocusIds]);

  const activeFocusRisks = mode === "auto" ? autoFocusRisks : manualFocusRisks;

  useEffect(() => {
    setPlanRows(buildWeeklyPlan(activeFocusRisks));
    setSelectedDayIndex(0);
  }, [activeFocusRisks]);

  const selectedDay = planRows[selectedDayIndex] ?? null;

  const overallLevel = useMemo(() => getOverallRiskLevel(activeFocusRisks), [activeFocusRisks]);
  const levelBadgeClass =
    overallLevel === "High"
      ? "border-red-500/35 bg-red-500/10 text-red-600"
      : overallLevel === "Medium"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-700"
        : "border-emerald-500/35 bg-emerald-500/10 text-emerald-700";

  const toggleFocus = (riskId: string) => {
    setSelectedFocusIds((previous) => {
      if (previous.includes(riskId)) {
        if (previous.length === 1) return previous;
        return previous.filter((id) => id !== riskId);
      }
      if (previous.length >= 2) return previous;
      return [...previous, riskId];
    });
  };

  return (
    <section className="glass-card rounded-3xl border-border/50 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Weekly Health Plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Simple 7-day plan generated locally from your current risk profile.</p>
        </div>
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${levelBadgeClass}`}>Overall {overallLevel}</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/55 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 1: Focus mode</p>
        <div className="inline-flex rounded-lg border border-border/60 bg-card/70 p-1">
          <Button type="button" variant={mode === "auto" ? "default" : "ghost"} className="h-8 rounded-md px-3 text-xs" onClick={() => setMode("auto")}>
            Auto (Recommended)
          </Button>
          <Button type="button" variant={mode === "manual" ? "default" : "ghost"} className="h-8 rounded-md px-3 text-xs" onClick={() => setMode("manual")}>
            Manual
          </Button>
        </div>

        {mode === "manual" ? (
          <div className="mt-3">
            <p className="mb-2 text-xs text-muted-foreground">Step 2: Pick up to 2 focus conditions</p>
            <div className="flex flex-wrap gap-2">
              {rankedRisks.map((risk) => (
                <Button
                  key={risk.id}
                  type="button"
                  variant={selectedFocusIds.includes(risk.id) ? "default" : "outline"}
                  className="h-8 rounded-lg px-3 text-xs"
                  onClick={() => toggleFocus(risk.id)}
                >
                  {risk.name}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Focus: <span className="font-semibold text-foreground">{activeFocusRisks.map((risk) => risk.name).join(", ") || "General Health"}</span>
          </p>
          <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={() => setPlanRows(buildWeeklyPlan(activeFocusRisks))}>
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh Plan
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-card/55 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 3: Pick a day</p>
        <div className="flex flex-wrap gap-2">
          {planRows.map((row, index) => (
            <Button
              key={`${row.dayLabel}-${row.dateLabel}`}
              type="button"
              variant={selectedDayIndex === index ? "default" : "outline"}
              className="h-8 rounded-lg px-3 text-xs"
              onClick={() => setSelectedDayIndex(index)}
            >
              {row.dayLabel} {row.dateLabel}
            </Button>
          ))}
        </div>

        {selectedDay ? (
          <article className="mt-3 rounded-xl border border-border/60 bg-card/70 p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="h-4 w-4 text-primary" />
              {selectedDay.dayLabel} plan
            </p>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Target className="h-3.5 w-3.5" />
              {selectedDay.focusName}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Food:</span> {selectedDay.food}
              </p>
              <p>
                <span className="font-semibold text-foreground">Activity:</span> {selectedDay.activity}
              </p>
              <p>
                <span className="font-semibold text-foreground">Check:</span> {selectedDay.check}
              </p>
              <p>
                <span className="font-semibold text-foreground">Caution:</span> {selectedDay.caution}
              </p>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
};

export default WeeklyPlanGenerator;
