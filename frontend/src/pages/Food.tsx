import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Beef,
  Clock3,
  Droplets,
  Flame,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
  Wheat,
  X,
} from "lucide-react";
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

type Dish = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  healthScore: number;
  price: number;
  imageIcon: string;
  tags: string[];
};

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  lat: number;
  lon: number;
  rating: number;
  deliveryEta: string;
  heroIcon: string;
  menu: Dish[];
};

const initialMeals: Meal[] = [
  { type: "Breakfast", items: "Oatmeal, banana, green tea", calories: 380, time: "8:00 AM" },
  { type: "Lunch", items: "Grilled chicken salad, brown rice", calories: 620, time: "12:30 PM" },
  { type: "Snack", items: "Greek yogurt, almonds", calories: 245, time: "3:30 PM" },
  { type: "Dinner", items: "Salmon, steamed vegetables", calories: 600, time: "7:00 PM" },
];

const restaurantData: Restaurant[] = [
  {
    id: "green-bowl",
    name: "Green Bowl Kitchen",
    cuisine: "Healthy Bowls",
    location: "Connaught Place, Delhi",
    lat: 28.6315,
    lon: 77.2167,
    rating: 4.6,
    deliveryEta: "20-30 min",
    heroIcon: "🥗",
    menu: [
      { id: "gb1", name: "Quinoa Protein Bowl", calories: 420, protein: 26, carbs: 44, fat: 14, sodium: 520, healthScore: 91, price: 349, imageIcon: "🥙", tags: ["recommended", "high protein"] },
      { id: "gb2", name: "Paneer Tikka Wrap", calories: 510, protein: 21, carbs: 49, fat: 22, sodium: 760, healthScore: 68, price: 289, imageIcon: "🌯", tags: ["balanced"] },
      { id: "gb3", name: "Cheesy Nacho Bowl", calories: 790, protein: 16, carbs: 78, fat: 36, sodium: 1420, healthScore: 36, price: 369, imageIcon: "🧀", tags: ["unhealthy"] },
      { id: "gb4", name: "Berry Smoothie", calories: 260, protein: 7, carbs: 36, fat: 8, sodium: 120, healthScore: 84, price: 199, imageIcon: "🥤", tags: ["light"] },
    ],
  },
  {
    id: "fit-bite",
    name: "FitBite Cafe",
    cuisine: "Fitness Meals",
    location: "Sector 18, Noida",
    lat: 28.5706,
    lon: 77.3272,
    rating: 4.4,
    deliveryEta: "25-35 min",
    heroIcon: "💪",
    menu: [
      { id: "fb1", name: "Grilled Chicken Meal Box", calories: 460, protein: 36, carbs: 34, fat: 18, sodium: 590, healthScore: 88, price: 399, imageIcon: "🍗", tags: ["recommended", "lean"] },
      { id: "fb2", name: "Greek Yogurt Fruit Bowl", calories: 280, protein: 14, carbs: 32, fat: 8, sodium: 180, healthScore: 94, price: 249, imageIcon: "🍓", tags: ["recommended"] },
      { id: "fb3", name: "Loaded Fries Platter", calories: 840, protein: 11, carbs: 90, fat: 42, sodium: 1520, healthScore: 29, price: 299, imageIcon: "🍟", tags: ["unhealthy"] },
      { id: "fb4", name: "Power Moong Chaat", calories: 310, protein: 18, carbs: 34, fat: 9, sodium: 290, healthScore: 86, price: 179, imageIcon: "🥣", tags: ["fiber rich"] },
    ],
  },
  {
    id: "urban-spice",
    name: "Urban Spice House",
    cuisine: "North Indian",
    location: "Cyber Hub, Gurugram",
    lat: 28.495,
    lon: 77.0895,
    rating: 4.3,
    deliveryEta: "30-40 min",
    heroIcon: "🍛",
    menu: [
      { id: "us1", name: "Dal Tadka + 2 Roti", calories: 430, protein: 17, carbs: 52, fat: 16, sodium: 640, healthScore: 78, price: 259, imageIcon: "🍲", tags: ["balanced"] },
      { id: "us2", name: "Tandoori Soya Chaap", calories: 360, protein: 24, carbs: 18, fat: 20, sodium: 700, healthScore: 74, price: 279, imageIcon: "🍢", tags: ["high protein"] },
      { id: "us3", name: "Butter Chicken + Naan", calories: 890, protein: 35, carbs: 62, fat: 55, sodium: 1710, healthScore: 33, price: 449, imageIcon: "🍗", tags: ["unhealthy"] },
      { id: "us4", name: "Cucumber Mint Raita", calories: 140, protein: 6, carbs: 12, fat: 6, sodium: 250, healthScore: 82, price: 129, imageIcon: "🥛", tags: ["light"] },
    ],
  },
  {
    id: "satvik-thali",
    name: "Satvik Thali Point",
    cuisine: "Vegetarian",
    location: "Rajouri Garden, Delhi",
    lat: 28.6425,
    lon: 77.1185,
    rating: 4.5,
    deliveryEta: "22-32 min",
    heroIcon: "🌿",
    menu: [
      { id: "st1", name: "Millet Thali", calories: 510, protein: 19, carbs: 66, fat: 18, sodium: 560, healthScore: 85, price: 319, imageIcon: "🍽️", tags: ["recommended"] },
      { id: "st2", name: "Veg Pulao + Raita", calories: 470, protein: 11, carbs: 68, fat: 14, sodium: 680, healthScore: 72, price: 269, imageIcon: "🍚", tags: ["balanced"] },
      { id: "st3", name: "Malai Kofta Combo", calories: 760, protein: 14, carbs: 54, fat: 46, sodium: 1380, healthScore: 38, price: 379, imageIcon: "🍛", tags: ["unhealthy"] },
      { id: "st4", name: "Sprout Salad", calories: 190, protein: 12, carbs: 20, fat: 5, sodium: 140, healthScore: 93, price: 159, imageIcon: "🥬", tags: ["recommended"] },
    ],
  },
];

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const getDishImpact = (dish: Dish) => {
  if (dish.healthScore >= 80) {
    return {
      label: "Low impact",
      tone: "text-health-teal",
      surface: "bg-health-teal/12",
      note: "Great for steady energy and recovery.",
      loads: [
        { key: "Calories", value: Math.min(Math.round((dish.calories / 2200) * 100), 100) },
        { key: "Sodium", value: Math.min(Math.round((dish.sodium / 2000) * 100), 100) },
        { key: "Crash risk", value: 24 },
      ],
    };
  }

  if (dish.healthScore >= 60) {
    return {
      label: "Moderate impact",
      tone: "text-yellow-500",
      surface: "bg-yellow-500/12",
      note: "Fits your day better with portion control.",
      loads: [
        { key: "Calories", value: Math.min(Math.round((dish.calories / 1800) * 100), 100) },
        { key: "Sodium", value: Math.min(Math.round((dish.sodium / 1600) * 100), 100) },
        { key: "Crash risk", value: 48 },
      ],
    };
  }

  return {
    label: "High impact",
    tone: "text-health-rose",
    surface: "bg-health-rose/12",
    note: "May impact hydration, sleep quality, and calorie balance.",
    loads: [
      { key: "Calories", value: Math.min(Math.round((dish.calories / 1300) * 100), 100) },
      { key: "Sodium", value: Math.min(Math.round((dish.sodium / 1200) * 100), 100) },
      { key: "Crash risk", value: 78 },
    ],
  };
};

const Food = () => {
  const [activeTab, setActiveTab] = useState<"meal" | "restaurant">("meal");
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [showAdd, setShowAdd] = useState(false);
  const [newMeal, setNewMeal] = useState<{ type: Meal["type"]; items: string; calories: string }>({
    type: "Breakfast",
    items: "",
    calories: "",
  });

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationText, setLocationText] = useState("Using nearby defaults");
  const [locating, setLocating] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

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

  const restaurantCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const enriched = restaurantData.map((restaurant) => {
      const distance = location
        ? getDistanceKm(location.lat, location.lon, restaurant.lat, restaurant.lon)
        : Math.max(1.1, Math.abs(restaurant.rating * 3.4 - 12));
      return { ...restaurant, distance };
    });

    const filtered = enriched.filter((restaurant) => {
      if (!normalizedQuery) return true;
      const menuText = restaurant.menu.map((dish) => dish.name.toLowerCase()).join(" ");
      return (
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisine.toLowerCase().includes(normalizedQuery) ||
        restaurant.location.toLowerCase().includes(normalizedQuery) ||
        menuText.includes(normalizedQuery)
      );
    });

    return filtered.sort((a, b) => a.distance - b.distance || b.rating - a.rating);
  }, [location, query]);

  const selectedRestaurant = selectedRestaurantId
    ? restaurantData.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null
    : null;

  const selectedDish = selectedRestaurant?.menu.find((dish) => dish.id === selectedDishId) ?? null;

  const recommendedDishes = useMemo(() => {
    if (!selectedRestaurant) return [];
    return [...selectedRestaurant.menu].sort((a, b) => b.healthScore - a.healthScore).slice(0, 2);
  }, [selectedRestaurant]);

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      setLocationText("Location not available on this device");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        setLocationText(`Near ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        setLocating(false);
      },
      () => {
        setLocationText("Location denied - showing nearby defaults");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    if (!selectedRestaurant) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedRestaurant]);

  return (
    <AppLayout title="Food" subtitle="Track nutrition and discover smarter choices near you.">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl border border-border/60 bg-card/55 p-1">
          <Button
            type="button"
            variant={activeTab === "meal" ? "default" : "ghost"}
            className="h-10 rounded-xl px-5"
            onClick={() => setActiveTab("meal")}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Meal
          </Button>
          <Button
            type="button"
            variant={activeTab === "restaurant" ? "default" : "ghost"}
            className="h-10 rounded-xl px-5"
            onClick={() => setActiveTab("restaurant")}
          >
            <Store className="h-4 w-4" />
            Restaurants
          </Button>
        </div>

        {activeTab === "meal" ? (
          <Button type="button" className="h-10 rounded-xl bg-primary px-4 text-primary-foreground" onClick={() => setShowAdd((prev) => !prev)}>
            <Plus className="h-4 w-4" />
            Add Meal
          </Button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{locationText}</span>
            <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={handleLocate} disabled={locating}>
              <LocateFixed className="h-3.5 w-3.5" />
              {locating ? "Locating..." : "Use my location"}
            </Button>
          </div>
        )}
      </section>

      {activeTab === "meal" ? (
        <>
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
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    / {macro.target}
                    {macro.unit}
                  </span>
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
        </>
      ) : (
        <>
          <section className="glass-card rounded-3xl border-border/50 p-4 sm:p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search restaurants or dishes"
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {restaurantCards.length ? (
              restaurantCards.map((restaurant, index) => (
                <motion.button
                  key={restaurant.id}
                  type="button"
                  onClick={() => {
                    setSelectedRestaurantId(restaurant.id);
                    setSelectedDishId(restaurant.menu[0]?.id ?? null);
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="glass-card hover-lift rounded-3xl border-border/50 p-5 text-left"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-3xl">{restaurant.heroIcon}</div>
                    <div className="rounded-xl bg-card/70 px-2.5 py-1 text-xs font-semibold text-primary">{restaurant.cuisine}</div>
                  </div>
                  <h3 className="text-lg font-bold">{restaurant.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{restaurant.location}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                      {restaurant.rating.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      {restaurant.deliveryEta}
                    </span>
                    <span>{restaurant.distance.toFixed(1)} km</span>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="glass-card col-span-full rounded-3xl border-border/50 p-6 text-sm text-muted-foreground">
                No restaurants found for this search.
              </div>
            )}
          </section>
        </>
      )}

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selectedRestaurant ? (
                <motion.div className="fixed inset-0 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                    onClick={() => {
                      setSelectedRestaurantId(null);
                      setSelectedDishId(null);
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
                    <motion.section
                      initial={{ opacity: 0, scale: 0.96, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_32px_80px_-28px_hsl(215_40%_5%/0.75)]"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 sm:px-6">
                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-bold">{selectedRestaurant.name}</h3>
                          <p className="text-sm text-muted-foreground">Tap a dish to see recommendation impact</p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 rounded-xl"
                          onClick={() => {
                            setSelectedRestaurantId(null);
                            setSelectedDishId(null);
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto overflow-x-hidden p-4 sm:p-6 2xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                        <article className="min-w-0">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Menu List</h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {selectedRestaurant.menu.map((dish) => (
                              <button
                                key={dish.id}
                                type="button"
                                onClick={() => setSelectedDishId(dish.id)}
                                className={`rounded-2xl border p-4 text-left transition hover:translate-y-[-1px] ${
                                  selectedDishId === dish.id
                                    ? "border-primary bg-primary/12 shadow-[0_16px_40px_-24px_hsl(var(--primary)/0.7)]"
                                    : "border-border/60 bg-card/70"
                                }`}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{dish.imageIcon}</div>
                                  <span className="text-sm font-bold text-primary">₹{dish.price}</span>
                                </div>
                                <p className="text-sm font-semibold">{dish.name}</p>
                                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span>{dish.calories} kcal</span>
                                  <span>Score {dish.healthScore}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </article>

                        <article className="min-w-0 space-y-4">
                          <div className="rounded-2xl border border-border/60 bg-card/65 p-4">
                            <p className="text-sm font-semibold text-primary">Recommended first</p>
                            <div className="mt-3 grid gap-2">
                              {recommendedDishes.map((dish) => (
                                <div key={dish.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 p-2.5">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-health-teal/12 text-xl">{dish.imageIcon}</div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{dish.name}</p>
                                    <p className="text-xs text-muted-foreground">Score {dish.healthScore} • ₹{dish.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedDish ? (
                            <div className="rounded-2xl border border-border/60 bg-card/65 p-4">
                              {(() => {
                                const impact = getDishImpact(selectedDish);
                                return (
                                  <>
                                    <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${impact.surface} ${impact.tone}`}>{impact.label}</div>
                                    <p className="mt-3 text-sm text-muted-foreground">{impact.note}</p>

                                    <div className="mt-4 space-y-3">
                                      {impact.loads.map((metric) => (
                                        <div key={metric.key}>
                                          <div className="mb-1.5 flex items-center justify-between text-xs">
                                            <span>{metric.key}</span>
                                            <span className="font-semibold">{metric.value}%</span>
                                          </div>
                                          <div className="h-2 rounded-full bg-muted">
                                            <div
                                              className={`h-full rounded-full ${
                                                metric.value >= 70 ? "bg-health-rose" : metric.value >= 45 ? "bg-yellow-500" : "bg-health-teal"
                                              }`}
                                              style={{ width: `${Math.min(metric.value, 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="mt-4 rounded-xl bg-card/80 p-3 text-xs text-muted-foreground">
                                      <span className="inline-flex items-center gap-1 text-health-rose">
                                        <ShieldAlert className="h-3.5 w-3.5" />
                                        If this is your frequent choice, balance with hydration + lighter next meal.
                                      </span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-dashed border-border/70 bg-card/45 p-4 text-sm text-muted-foreground">
                              Select any dish to see visual health impact.
                            </div>
                          )}
                        </article>
                      </div>
                    </motion.section>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </AppLayout>
  );
};

export default Food;
