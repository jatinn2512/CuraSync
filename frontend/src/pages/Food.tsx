import { useState } from "react";
import { motion } from "framer-motion";
import { Beef, Droplets, Flame, Plus, Sparkles, UtensilsCrossed, Wheat } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";

const macros = [
  { label: "Calories", value: 1845, target: 2200, unit: "kcal", icon: Flame, color: "text-health-rose", bg: "bg-health-rose/12" },
  { label: "Protein", value: 78, target: 120, unit: "g", icon: Beef, color: "text-health-teal", bg: "bg-health-teal/12" },
  { label: "Carbs", value: 220, target: 280, unit: "g", icon: Wheat, color: "text-health-cyan", bg: "bg-health-cyan/12" },
  { label: "Fats", value: 55, target: 70, unit: "g", icon: Droplets, color: "text-health-violet", bg: "bg-health-violet/12" },
] as const;

type Meal = {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  items: string;
  calories: number;
  time: string;
};

const initialMeals: Meal[] = [
  { type: "Breakfast", items: "Oatmeal, banana, green tea", calories: 380, time: "8:00 AM" },
  { type: "Lunch", items: "Grilled chicken salad, brown rice", calories: 620, time: "12:30 PM" },
  { type: "Snack", items: "Greek yogurt, almonds", calories: 245, time: "3:30 PM" },
  { type: "Dinner", items: "Salmon, steamed vegetables", calories: 600, time: "7:00 PM" },
];

const Food = () => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [showAdd, setShowAdd] = useState(false);
  const [newMeal, setNewMeal] = useState<{ type: Meal["type"]; items: string; calories: string }>({
    type: "Breakfast",
    items: "",
    calories: "",
  });

  const addMeal = () => {
    if (!newMeal.items.trim()) return;

    setMeals((prev) => [
      {
        type: newMeal.type,
        items: newMeal.items.trim(),
        calories: Number.parseInt(newMeal.calories, 10) || 0,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setNewMeal({ type: "Breakfast", items: "", calories: "" });
    setShowAdd(false);
  };

  return (
    <AppLayout title="Food" subtitle="Track nutrition, log meals, and stay aligned with your daily goals.">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Nutrition Tracker</h2>
        <Button type="button" className="h-10 rounded-xl bg-primary px-4 text-primary-foreground" onClick={() => setShowAdd((prev) => !prev)}>
          <Plus className="h-4 w-4" />
          Add Meal
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {macros.map((macro, index) => (
          <motion.article
            key={macro.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-3xl border-border/50 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${macro.bg}`}>
                <macro.icon className={`h-4 w-4 ${macro.color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{macro.label}</span>
            </div>
            <p className="text-xl font-bold">
              {macro.value}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ {macro.target}{macro.unit}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((macro.value / macro.target) * 100, 100)}%` }} />
            </div>
          </motion.article>
        ))}
      </section>

      {showAdd ? (
        <motion.section initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl border-border/50 p-4">
          <div className="grid gap-3 md:grid-cols-[170px_minmax(0,1fr)_130px_auto]">
            <select
              value={newMeal.type}
              onChange={(event) => setNewMeal((prev) => ({ ...prev, type: event.target.value as Meal["type"] }))}
              className="h-11 rounded-xl border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
            >
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              value={newMeal.items}
              onChange={(event) => setNewMeal((prev) => ({ ...prev, items: event.target.value }))}
              placeholder="Meal items"
              className="h-11 rounded-xl border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
            />
            <input
              type="number"
              min={0}
              value={newMeal.calories}
              onChange={(event) => setNewMeal((prev) => ({ ...prev, calories: event.target.value }))}
              placeholder="Calories"
              className="h-11 rounded-xl border border-border/60 bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
            />
            <Button type="button" className="h-11 rounded-xl bg-primary px-5 text-primary-foreground" onClick={addMeal}>
              Add
            </Button>
          </div>
        </motion.section>
      ) : null}

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          Today's Meals
        </h2>
        <div className="space-y-3">
          {meals.map((meal, index) => (
            <motion.article
              key={`${meal.type}-${meal.time}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 p-3"
            >
              <div>
                <p className="text-sm font-semibold">{meal.type}</p>
                <p className="text-xs text-muted-foreground">{meal.items}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{meal.calories} kcal</p>
                <p className="text-xs text-muted-foreground">{meal.time}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-3xl border-border/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-health-violet" />
          AI Diet Suggestions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Add omega-3 sources like chia seeds or walnuts to breakfast.",
            "Protein is below target today. Include a high-protein snack post-workout.",
            "Fiber intake is strong. Continue whole grains and mixed vegetables.",
            "Swap refined carbs with sweet potatoes or quinoa for steadier energy.",
          ].map((tip) => (
            <div key={tip} className="rounded-2xl border border-border/60 bg-card/55 p-3 text-sm leading-relaxed text-muted-foreground">
              {tip}
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Food;
