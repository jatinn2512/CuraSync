import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Plus, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/Button";

type StressLevel = "low" | "medium" | "high";
type Relation = "self" | "mother" | "father" | "spouse" | "child" | "other";

type FamilyProfile = {
  id: string;
  name: string;
  relation: Relation;
  age: number;
  baseline_conditions: string;
  consent_flag: boolean;
  created_at: string;
};

type DailyCheckIn = {
  id: string;
  profile_id: string;
  date: string;
  sleep_hours: number;
  steps: number;
  fasting_sugar: number | null;
  systolic_bp: number | null;
  stress_level: StressLevel;
};

type PersistedState = {
  profiles: FamilyProfile[];
  activeProfileId: string | null;
  checkinsByProfile: Record<string, DailyCheckIn[]>;
};

type DriftPoint = {
  date: string;
  score: number;
  drift: number;
  factors: Record<"sleep" | "steps" | "sugar" | "bp" | "stress", number>;
};

type DriftAnalysis = {
  points: DriftPoint[];
  baseline: number;
  latestScore: number;
  latestDrift: number;
  trendDelta: number;
  trendLabel: "Improving" | "Stable" | "Worsening";
  topFactors: Array<{ key: "sleep" | "steps" | "sugar" | "bp" | "stress"; label: string; value: number }>;
};

const STORAGE_KEY = "curasync-risk-drift-v1";

const relationOptions: Array<{ value: Relation; label: string }> = [
  { value: "self", label: "Self" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "other", label: "Other" },
];

const relationLabelMap: Record<Relation, string> = {
  self: "Self",
  mother: "Mother",
  father: "Father",
  spouse: "Spouse",
  child: "Child",
  other: "Other",
};

const factorLabelMap: Record<"sleep" | "steps" | "sugar" | "bp" | "stress", string> = {
  sleep: "Sleep quality",
  steps: "Daily movement",
  sugar: "Fasting sugar",
  bp: "Blood pressure",
  stress: "Stress level",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createDefaultProfile = (): FamilyProfile => ({
  id: "self-profile",
  name: "Me",
  relation: "self",
  age: 25,
  baseline_conditions: "",
  consent_flag: true,
  created_at: new Date().toISOString(),
});

const normalizePersistedState = (raw: unknown): PersistedState | null => {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Partial<PersistedState>;

  const profiles = Array.isArray(payload.profiles)
    ? payload.profiles.filter((item): item is FamilyProfile => Boolean(item && typeof item === "object" && "id" in item && "name" in item))
    : [];

  const checkinsByProfile =
    payload.checkinsByProfile && typeof payload.checkinsByProfile === "object" ? payload.checkinsByProfile : {};

  return {
    profiles,
    activeProfileId: payload.activeProfileId ?? null,
    checkinsByProfile: checkinsByProfile as Record<string, DailyCheckIn[]>,
  };
};

const evaluateCheckIn = (entry: DailyCheckIn): { score: number; factors: DriftPoint["factors"] } => {
  let score = 35;
  const factors: DriftPoint["factors"] = { sleep: 0, steps: 0, sugar: 0, bp: 0, stress: 0 };

  if (entry.sleep_hours < 5.5) {
    score += 18;
    factors.sleep += 18;
  } else if (entry.sleep_hours < 6.5) {
    score += 10;
    factors.sleep += 10;
  } else if (entry.sleep_hours < 7) {
    score += 4;
    factors.sleep += 4;
  } else if (entry.sleep_hours <= 8.5) {
    score -= 4;
    factors.sleep -= 4;
  } else {
    score += 2;
    factors.sleep += 2;
  }

  if (entry.steps < 3000) {
    score += 18;
    factors.steps += 18;
  } else if (entry.steps < 6000) {
    score += 11;
    factors.steps += 11;
  } else if (entry.steps < 9000) {
    score += 5;
    factors.steps += 5;
  } else if (entry.steps >= 11000) {
    score -= 6;
    factors.steps -= 6;
  } else {
    score -= 3;
    factors.steps -= 3;
  }

  if (entry.fasting_sugar !== null) {
    if (entry.fasting_sugar >= 126) {
      score += 18;
      factors.sugar += 18;
    } else if (entry.fasting_sugar >= 110) {
      score += 11;
      factors.sugar += 11;
    } else if (entry.fasting_sugar >= 95) {
      score += 4;
      factors.sugar += 4;
    } else {
      score -= 3;
      factors.sugar -= 3;
    }
  }

  if (entry.systolic_bp !== null) {
    if (entry.systolic_bp >= 140) {
      score += 18;
      factors.bp += 18;
    } else if (entry.systolic_bp >= 130) {
      score += 11;
      factors.bp += 11;
    } else if (entry.systolic_bp >= 120) {
      score += 5;
      factors.bp += 5;
    } else {
      score -= 3;
      factors.bp -= 3;
    }
  }

  if (entry.stress_level === "high") {
    score += 14;
    factors.stress += 14;
  } else if (entry.stress_level === "medium") {
    score += 7;
    factors.stress += 7;
  } else {
    score -= 2;
    factors.stress -= 2;
  }

  return {
    score: clamp(Number(score.toFixed(1)), 5, 95),
    factors,
  };
};

const buildDriftAnalysis = (entries: DailyCheckIn[]): DriftAnalysis => {
  if (!entries.length) {
    return {
      points: [],
      baseline: 0,
      latestScore: 0,
      latestDrift: 0,
      trendDelta: 0,
      trendLabel: "Stable",
      topFactors: [],
    };
  }

  const ordered = [...entries].sort((left, right) => left.date.localeCompare(right.date));
  const evaluated = ordered.map((entry) => {
    const result = evaluateCheckIn(entry);
    return {
      date: entry.date,
      score: result.score,
      factors: result.factors,
    };
  });

  const baselineWindow = evaluated.slice(0, Math.min(3, evaluated.length));
  const baseline = baselineWindow.reduce((sum, item) => sum + item.score, 0) / baselineWindow.length;

  const points: DriftPoint[] = evaluated.map((item) => ({
    date: item.date,
    score: item.score,
    drift: Number((item.score - baseline).toFixed(1)),
    factors: item.factors,
  }));

  const latest = points[points.length - 1];
  const latestDrift = Number((latest.score - baseline).toFixed(1));

  const recentWindow = points.slice(-7);
  const previousWindow = points.slice(-14, -7);
  const recentAvg = recentWindow.reduce((sum, item) => sum + item.score, 0) / recentWindow.length;
  const previousAvg = previousWindow.length
    ? previousWindow.reduce((sum, item) => sum + item.score, 0) / previousWindow.length
    : baseline;
  const trendDelta = Number((recentAvg - previousAvg).toFixed(1));

  const trendLabel: DriftAnalysis["trendLabel"] = trendDelta >= 3.5 ? "Worsening" : trendDelta <= -3.5 ? "Improving" : "Stable";

  const factorTotals: Record<"sleep" | "steps" | "sugar" | "bp" | "stress", number> = {
    sleep: 0,
    steps: 0,
    sugar: 0,
    bp: 0,
    stress: 0,
  };

  for (const point of recentWindow) {
    for (const [key, value] of Object.entries(point.factors) as Array<[keyof typeof factorTotals, number]>) {
      if (value > 0) {
        factorTotals[key] += value;
      }
    }
  }

  const topFactors = (Object.keys(factorTotals) as Array<keyof typeof factorTotals>)
    .map((key) => ({
      key,
      label: factorLabelMap[key],
      value: Number((factorTotals[key] / Math.max(recentWindow.length, 1)).toFixed(1)),
    }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 2);

  return {
    points,
    baseline: Number(baseline.toFixed(1)),
    latestScore: latest.score,
    latestDrift,
    trendDelta,
    trendLabel,
    topFactors,
  };
};

const RiskDriftTracker = () => {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([createDefaultProfile()]);
  const [activeProfileId, setActiveProfileId] = useState<string>("self-profile");
  const [checkinsByProfile, setCheckinsByProfile] = useState<Record<string, DailyCheckIn[]>>({});
  const [trendRange, setTrendRange] = useState<"7" | "30">("7");
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [newProfile, setNewProfile] = useState({
    name: "",
    relation: "mother" as Relation,
    age: "",
    baseline_conditions: "",
    consent_flag: false,
  });

  const [checkinForm, setCheckinForm] = useState({
    sleep_hours: "7",
    steps: "8000",
    fasting_sugar: "",
    systolic_bp: "",
    stress_level: "medium" as StressLevel,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = normalizePersistedState(JSON.parse(raw));
      if (!parsed) return;

      const profileList = parsed.profiles.length ? parsed.profiles : [createDefaultProfile()];
      const defaultProfile = profileList.find((profile) => profile.id === "self-profile");
      const withSelf = defaultProfile ? profileList : [createDefaultProfile(), ...profileList];

      setProfiles(withSelf);
      setCheckinsByProfile(parsed.checkinsByProfile || {});

      const activeId = parsed.activeProfileId && withSelf.some((profile) => profile.id === parsed.activeProfileId) ? parsed.activeProfileId : "self-profile";
      setActiveProfileId(activeId);
    } catch {
      // Ignore corrupt local state and continue with defaults.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: PersistedState = {
      profiles,
      activeProfileId,
      checkinsByProfile,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [activeProfileId, checkinsByProfile, profiles]);

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null,
    [activeProfileId, profiles],
  );

  useEffect(() => {
    if (!activeProfile && profiles.length) {
      setActiveProfileId(profiles[0].id);
    }
  }, [activeProfile, profiles]);

  const activeCheckins = useMemo(() => {
    if (!activeProfile) return [];
    return [...(checkinsByProfile[activeProfile.id] ?? [])].sort((left, right) => right.date.localeCompare(left.date));
  }, [activeProfile, checkinsByProfile]);

  const drift = useMemo(() => buildDriftAnalysis(activeCheckins), [activeCheckins]);

  const chartRows = useMemo(() => {
    const limit = Number(trendRange);
    return drift.points.slice(-limit);
  }, [drift.points, trendRange]);

  const maxChartScore = useMemo(() => {
    if (!chartRows.length) return 100;
    return Math.max(...chartRows.map((row) => row.score), 60);
  }, [chartRows]);

  const trendBadgeClass =
    drift.trendLabel === "Worsening"
      ? "border-red-500/35 bg-red-500/10 text-red-600"
      : drift.trendLabel === "Improving"
        ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700"
        : "border-amber-500/35 bg-amber-500/10 text-amber-700";

  const addProfile = () => {
    const name = newProfile.name.trim();
    if (!name) {
      setStatusMessage("Profile name is required.");
      return;
    }
    if (!newProfile.consent_flag) {
      setStatusMessage("Consent is required before adding family profile.");
      return;
    }

    const profile: FamilyProfile = {
      id: createId(),
      name,
      relation: newProfile.relation,
      age: Number.parseInt(newProfile.age, 10) || 0,
      baseline_conditions: newProfile.baseline_conditions.trim(),
      consent_flag: true,
      created_at: new Date().toISOString(),
    };

    setProfiles((previous) => [...previous, profile]);
    setActiveProfileId(profile.id);
    setShowAddProfile(false);
    setNewProfile({
      name: "",
      relation: "mother",
      age: "",
      baseline_conditions: "",
      consent_flag: false,
    });
    setStatusMessage(`${profile.name} profile added.`);
  };

  const removeActiveProfile = () => {
    if (!activeProfile || activeProfile.relation === "self") return;
    setProfiles((previous) => previous.filter((profile) => profile.id !== activeProfile.id));
    setCheckinsByProfile((previous) => {
      const next = { ...previous };
      delete next[activeProfile.id];
      return next;
    });
    setActiveProfileId("self-profile");
    setStatusMessage(`${activeProfile.name} profile removed.`);
  };

  const submitCheckIn = () => {
    if (!activeProfile) return;

    const sleepHours = Number.parseFloat(checkinForm.sleep_hours);
    const steps = Number.parseInt(checkinForm.steps, 10);
    if (!Number.isFinite(sleepHours) || sleepHours <= 0 || !Number.isFinite(steps) || steps < 0) {
      setStatusMessage("Enter valid sleep hours and steps.");
      return;
    }

    const dateKey = new Date().toISOString().slice(0, 10);
    const entry: DailyCheckIn = {
      id: createId(),
      profile_id: activeProfile.id,
      date: dateKey,
      sleep_hours: Number(sleepHours.toFixed(1)),
      steps,
      fasting_sugar: checkinForm.fasting_sugar ? Number.parseFloat(checkinForm.fasting_sugar) : null,
      systolic_bp: checkinForm.systolic_bp ? Number.parseInt(checkinForm.systolic_bp, 10) : null,
      stress_level: checkinForm.stress_level,
    };

    setCheckinsByProfile((previous) => {
      const current = previous[activeProfile.id] ?? [];
      const withoutToday = current.filter((item) => item.date !== dateKey);
      const next = [entry, ...withoutToday].sort((left, right) => right.date.localeCompare(left.date));
      return {
        ...previous,
        [activeProfile.id]: next,
      };
    });

    setStatusMessage(`Check-in saved for ${activeProfile.name}.`);
  };

  return (
    <section className="glass-card rounded-3xl border-border/50 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Family Mode + Daily Risk Drift Tracker</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track multiple profiles locally with 30-second daily check-ins.</p>
        </div>
        <span className="inline-flex rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground">Offline mode</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <article className="rounded-2xl border border-border/60 bg-card/55 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Profiles
            </p>
            <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={() => setShowAddProfile((prev) => !prev)}>
              <UserPlus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <Button
                key={profile.id}
                type="button"
                variant={activeProfile?.id === profile.id ? "default" : "outline"}
                className="h-8 rounded-lg px-3 text-xs"
                onClick={() => setActiveProfileId(profile.id)}
              >
                {profile.name}
              </Button>
            ))}
          </div>

          {activeProfile ? (
            <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Relation:</span> {relationLabelMap[activeProfile.relation]}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-foreground">Age:</span> {activeProfile.age || "N/A"}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-foreground">Baseline:</span> {activeProfile.baseline_conditions || "Not provided"}
              </p>
              {activeProfile.relation !== "self" ? (
                <Button type="button" variant="outline" className="mt-3 h-7 rounded-md px-2 text-[11px]" onClick={removeActiveProfile}>
                  Remove profile
                </Button>
              ) : null}
            </div>
          ) : null}

          {showAddProfile ? (
            <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-card/70 p-3 text-sm">
              <input
                value={newProfile.name}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={newProfile.relation}
                  onChange={(event) => setNewProfile((prev) => ({ ...prev, relation: event.target.value as Relation }))}
                  className="h-9 rounded-lg border border-border/60 bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                >
                  {relationOptions
                    .filter((option) => option.value !== "self")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={newProfile.age}
                  onChange={(event) => setNewProfile((prev) => ({ ...prev, age: event.target.value }))}
                  placeholder="Age"
                  className="h-9 rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
              <input
                value={newProfile.baseline_conditions}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, baseline_conditions: event.target.value }))}
                placeholder="Baseline conditions (optional)"
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
              />
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={newProfile.consent_flag}
                  onChange={(event) => setNewProfile((prev) => ({ ...prev, consent_flag: event.target.checked }))}
                />
                Consent available for this profile
              </label>
              <Button type="button" className="h-8 rounded-lg px-3 text-xs" onClick={addProfile}>
                <Plus className="h-3.5 w-3.5" />
                Save profile
              </Button>
            </div>
          ) : null}
        </article>

        <article className="rounded-2xl border border-border/60 bg-card/55 p-4">
          <p className="mb-3 text-sm font-semibold">Daily 30-second check-in</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs text-muted-foreground">
              <span>Sleep hours</span>
              <input
                type="number"
                min={0}
                step={0.5}
                value={checkinForm.sleep_hours}
                onChange={(event) => setCheckinForm((prev) => ({ ...prev, sleep_hours: event.target.value }))}
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              <span>Steps</span>
              <input
                type="number"
                min={0}
                value={checkinForm.steps}
                onChange={(event) => setCheckinForm((prev) => ({ ...prev, steps: event.target.value }))}
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              <span>Fasting sugar (optional)</span>
              <input
                type="number"
                min={0}
                value={checkinForm.fasting_sugar}
                onChange={(event) => setCheckinForm((prev) => ({ ...prev, fasting_sugar: event.target.value }))}
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground">
              <span>Systolic BP (optional)</span>
              <input
                type="number"
                min={0}
                value={checkinForm.systolic_bp}
                onChange={(event) => setCheckinForm((prev) => ({ ...prev, systolic_bp: event.target.value }))}
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="space-y-1 text-xs text-muted-foreground sm:col-span-2">
              <span>Stress level</span>
              <div className="inline-flex rounded-lg border border-border/60 bg-card/70 p-1">
                {(["low", "medium", "high"] as StressLevel[]).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={checkinForm.stress_level === level ? "default" : "ghost"}
                    className="h-7 rounded-md px-3 text-[11px]"
                    onClick={() => setCheckinForm((prev) => ({ ...prev, stress_level: level }))}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </label>
          </div>
          <Button type="button" className="mt-3 h-9 rounded-lg px-4 text-xs" onClick={submitCheckIn}>
            Save check-in
          </Button>
          {statusMessage ? <p className="mt-2 text-xs text-muted-foreground">{statusMessage}</p> : null}
        </article>
      </div>

      <article className="mt-4 rounded-2xl border border-border/60 bg-card/55 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">Risk Drift Trend</p>
          <div className="inline-flex rounded-lg border border-border/60 bg-card/70 p-1">
            <Button type="button" variant={trendRange === "7" ? "default" : "ghost"} className="h-7 rounded-md px-3 text-[11px]" onClick={() => setTrendRange("7")}>
              7 days
            </Button>
            <Button type="button" variant={trendRange === "30" ? "default" : "ghost"} className="h-7 rounded-md px-3 text-[11px]" onClick={() => setTrendRange("30")}>
              30 days
            </Button>
          </div>
        </div>

        {chartRows.length ? (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${trendBadgeClass}`}>
                {drift.trendLabel === "Improving" ? <TrendingDown className="h-3.5 w-3.5" /> : drift.trendLabel === "Worsening" ? <TrendingUp className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {drift.trendLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                Latest score {drift.latestScore.toFixed(1)} | Drift {drift.latestDrift >= 0 ? "+" : ""}
                {drift.latestDrift.toFixed(1)} vs baseline {drift.baseline.toFixed(1)}
              </span>
            </div>

            <div className="grid h-52 grid-cols-7 items-end gap-2 rounded-xl border border-border/60 bg-card/70 p-3">
              {chartRows.slice(-7).map((row) => (
                <div key={row.date} className="flex h-full flex-col justify-end">
                  <div
                    className={`min-h-2 rounded-t-md ${row.drift > 0 ? "bg-red-500/75" : row.drift < 0 ? "bg-emerald-500/75" : "bg-amber-500/75"}`}
                    style={{ height: `${Math.max((row.score / maxChartScore) * 100, 8)}%` }}
                  />
                  <p className="mt-1 text-center text-[10px] text-muted-foreground">{new Date(row.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-xs text-muted-foreground">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Top risk factors this week</p>
                {drift.topFactors.length ? (
                  drift.topFactors.map((factor) => (
                    <p key={factor.key}>
                      <span className="font-semibold text-foreground">{factor.label}:</span> +{factor.value.toFixed(1)} impact points
                    </p>
                  ))
                ) : (
                  <p>No worsening factors detected this week.</p>
                )}
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-xs text-muted-foreground">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Recent check-ins</p>
                {activeCheckins.slice(0, 3).map((entry) => (
                  <p key={entry.id}>
                    {new Date(entry.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}: {entry.sleep_hours}h sleep, {entry.steps} steps, stress {entry.stress_level}
                  </p>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
            Add daily check-ins to see drift trend and top risk factors.
          </div>
        )}
      </article>
    </section>
  );
};

export default RiskDriftTracker;
