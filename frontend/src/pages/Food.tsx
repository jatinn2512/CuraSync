import { motion } from "framer-motion";
import { Apple, Beef, Droplets, Flame, Leaf, Wheat } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const meals = [
  {
    title: "Breakfast",
    dish: "Greek yogurt bowl with berries",
    calories: 420,
    macros: "P 24g | C 46g | F 14g",
    icon: Apple,
  },
  {
    title: "Lunch",
    dish: "Grilled chicken quinoa salad",
    calories: 560,
    macros: "P 38g | C 50g | F 22g",
    icon: Leaf,
  },
  {
    title: "Dinner",
    dish: "Baked salmon with greens",
    calories: 610,
    macros: "P 42g | C 34g | F 28g",
    icon: Beef,
  },
];

const goals = [
  { label: "Calories", current: 1590, target: 2100, icon: Flame, color: "bg-health-rose" },
  { label: "Protein", current: 104, target: 130, icon: Beef, color: "bg-health-indigo" },
  { label: "Fiber", current: 21, target: 30, icon: Wheat, color: "bg-health-teal" },
  { label: "Water (ml)", current: 1700, target: 2500, icon: Droplets, color: "bg-health-cyan" },
];

const Food = () => {
  return (
    <AppLayout
      title="Food"
      subtitle="Plan meals, monitor macros, and stay aligned with your daily nutrition targets."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {meals.map((meal, index) => (
          <motion.article
            key={meal.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{meal.title}</span>
              <meal.icon className="h-5 w-5 text-health-teal" />
            </div>
            <h2 className="text-lg font-semibold">{meal.dish}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{meal.macros}</p>
            <p className="mt-4 text-2xl font-bold">{meal.calories} kcal</p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="mb-5 text-xl font-semibold">Daily Nutrition Goals</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));

            return (
              <article key={goal.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <goal.icon className="h-4 w-4" />
                    {goal.label}
                  </span>
                  <span className="font-medium">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${goal.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </motion.section>
    </AppLayout>
  );
};

export default Food;
