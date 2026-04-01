import { motion } from "framer-motion";
import { MapPin, Wind } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const cities = [
  { city: "New Delhi", aqi: 132, quality: "Unhealthy for Sensitive", color: "text-health-rose" },
  { city: "Mumbai", aqi: 82, quality: "Moderate", color: "text-health-indigo" },
  { city: "Bengaluru", aqi: 58, quality: "Moderate", color: "text-health-cyan" },
  { city: "Pune", aqi: 44, quality: "Good", color: "text-health-teal" },
];

const guidance = [
  "Use a mask for outdoor workouts when AQI is above 100.",
  "Keep indoor plants near windows to support better air circulation.",
  "Run an air purifier for at least 3 hours during evening peak traffic.",
];

const Aqi = () => {
  return (
    <AppLayout
      title="AQI"
      subtitle="Monitor local air quality and get practical recommendations to protect your breathing health."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cities.map((item, index) => (
          <motion.article
            key={item.city}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {item.city}
              </span>
              <Wind className="h-5 w-5 text-health-cyan" />
            </div>
            <p className={`mt-3 text-3xl font-bold ${item.color}`}>{item.aqi}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.quality}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">Live AQI Trend</h2>
          <div className="space-y-4">
            {[38, 52, 67, 74, 62, 58, 44].map((value, index) => (
              <div key={index}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hour {index + 1}</span>
                  <span className="font-medium">AQI {value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-health-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, value)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="mb-4 text-xl font-semibold">Protection Tips</h2>
          <ul className="space-y-3">
            {guidance.map((item) => (
              <li key={item} className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </motion.article>
      </section>
    </AppLayout>
  );
};

export default Aqi;
