import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCcw } from "lucide-react";
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
      "10-minute post-dinner walk to blunt glucose spikes.",
    ],
    check: [
      "Check fasting sugar in the morning.",
      "Track meal timing consistency for the day.",
      "Review cravings and sugar triggers before sleep.",
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
      "Measure BP at the same time today.",
      "Log stress level after work hours.",
      "Track hydration during the day.",
    ],
    caution: [
      "Avoid excess caffeine late evening.",
      "Do not stack intense activity on poor sleep days.",
      "Limit highly processed foods today.",
    ],
  },
  heart: {
    food: [
      "Prefer grilled or steamed meals over fried.",
      "Add omega-3 source or nuts in controlled quantity.",
      "Keep dinner lighter than lunch.",
    ],
    activity: [
      "25-minute cardio in easy-to-moderate zone.",
      "10-minute warm-up and cool-down.",
      "Avoid sudden high-intensity sprinting today.",
    ],
    check: [
      "Track resting pulse after waking.",
      "Review today's activity minutes by evening.",
      "Note any unusual fatigue or breathlessness.",
    ],
    caution: [
      "Avoid smoking and second-hand smoke exposure.",
      "Keep stress triggers low in late hours.",
      "Do not ignore chest discomfort symptoms.",
    ],
  },
  obesity: {
    food: [
      "Keep one plate method: half veggies, quarter protein.",
      "Choose high-satiety snacks (fruit, yogurt, nuts).",
      "Avoid liquid calories and heavy late dinner.",
    ],
    activity: [
      "40-minute total movement goal across the day.",
      "Add one strength circuit (push, pull, squat).",
      "Take a 5-minute walk after each long sitting block.",
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
      "Prefer warm, light meals on high AQI day.",
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
      "Hit at least 30 minutes of movement today.",
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
      [...conditionRisks].sort((left, right) => scoreByLevel[right.level] - scoreByLevel[left.level] || left.name.localeCompare(right.name)),
    [conditionRisks],
  );

  const defaultFocusIds = useMemo(() => {
    const highPriority = rankedRisks.filter((risk) => risk.level === "High").slice(0, 2);
    if (highPriority.length) return highPriority.map((risk) => risk.id);
    return rankedRisks.slice(0, 2).map((risk) => risk.id);
  }, [rankedRisks]);

  const availableRiskIds = useMemo(() => new Set(rankedRisks.map((risk) => risk.id)), [rankedRisks]);
  const [selectedFocusIds, setSelectedFocusIds] = useState<string[]>([]);
  const [planRows, setPlanRows] = useState<WeeklyPlanRow[]>([]);

  useEffect(() => {
    setSelectedFocusIds((previous) => {
      const validPrevious = previous.filter((id) => availableRiskIds.has(id));
      if (validPrevious.length) return validPrevious;
      return defaultFocusIds;
    });
  }, [availableRiskIds, defaultFocusIds]);

  const selectedFocusRisks = useMemo(() => {
    const selected = rankedRisks.filter((risk) => selectedFocusIds.includes(risk.id));
    return selected.length ? selected : rankedRisks.slice(0, 1);
  }, [rankedRisks, selectedFocusIds]);

  useEffect(() => {
    setPlanRows(buildWeeklyPlan(selectedFocusRisks));
  }, [selectedFocusRisks]);

  const overallLevel = useMemo(() => getOverallRiskLevel(selectedFocusRisks), [selectedFocusRisks]);

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
      if (previous.length >= 3) return previous;
      return [...previous, riskId];
    });
  };

  return (
    <section className="glass-card rounded-3xl border-border/50 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Weekly Health Plan Generator</h2>
          <p className="mt-1 text-sm text-muted-foreground">7-day action plan generated locally from your selected risk focus.</p>
        </div>
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${levelBadgeClass}`}>Overall {overallLevel}</span>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Focus conditions (max 3)</p>
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Plan focus:{" "}
          <span className="font-semibold text-foreground">{selectedFocusRisks.map((risk) => risk.name).join(", ") || "General Health"}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-lg px-3 text-xs"
          onClick={() => setPlanRows(buildWeeklyPlan(selectedFocusRisks))}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Regenerate
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {planRows.map((row) => (
          <article key={`${row.dayLabel}-${row.dateLabel}`} className="rounded-2xl border border-border/60 bg-card/55 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">{row.dayLabel}</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-2 py-1 text-[11px] text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {row.dateLabel}
              </span>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">{row.focusName}</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Food:</span> {row.food}
              </p>
              <p>
                <span className="font-semibold text-foreground">Activity:</span> {row.activity}
              </p>
              <p>
                <span className="font-semibold text-foreground">Check:</span> {row.check}
              </p>
              <p>
                <span className="font-semibold text-foreground">Caution:</span> {row.caution}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WeeklyPlanGenerator;
