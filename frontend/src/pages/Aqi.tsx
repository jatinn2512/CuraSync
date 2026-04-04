import { motion } from "framer-motion";
import { CloudRain, Droplets, MapPin, ShieldAlert, Thermometer, Wind } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const aqiValue = 68;

const getAqiStatus = (value: number) => {
  if (value <= 50) return { label: "Good", color: "text-health-teal", bg: "bg-health-teal/12", desc: "Air quality is satisfactory." };
  if (value <= 100) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/12", desc: "Air quality is acceptable." };
  if (value <= 150) {
    return { label: "Unhealthy (Sensitive)", color: "text-orange-500", bg: "bg-orange-500/12", desc: "Sensitive groups may experience mild effects." };
  }
  return { label: "Unhealthy", color: "text-health-rose", bg: "bg-health-rose/12", desc: "Everyone may begin to experience effects." };
};

const pollutants = [
  { name: "PM2.5", value: "18 ug/m3", status: "Good", icon: Droplets, color: "text-health-teal" },
  { name: "PM10", value: "42 ug/m3", status: "Moderate", icon: Wind, color: "text-yellow-500" },
  { name: "CO", value: "0.6 mg/m3", status: "Good", icon: CloudRain, color: "text-health-cyan" },
  { name: "NO2", value: "28 ppb", status: "Moderate", icon: Thermometer, color: "text-orange-500" },
] as const;

const recommendations = [
  "Air quality is moderate. Outdoor exercise is fine for most people.",
  "Wear a mask outdoors if you have respiratory sensitivity.",
  "Keep windows open during cleaner morning hours for fresh airflow.",
  "Stay hydrated to help your body cope with mild pollutants.",
] as const;

const hourlyTrend = [
  { hour: "6AM", value: 44 },
  { hour: "9AM", value: 58 },
  { hour: "12PM", value: 72 },
  { hour: "3PM", value: 81 },
  { hour: "6PM", value: 66 },
  { hour: "9PM", value: 53 },
] as const;

const Aqi = () => {
  const status = getAqiStatus(aqiValue);
  const markerLeftPercent = Math.min((aqiValue / 300) * 100, 100);
  const hourlyMax = Math.max(...hourlyTrend.map((item) => item.value));

  return (
    <AppLayout title="AQI" subtitle="Live air quality monitoring with city-level insights and health guidance.">
      <section className="glass-card overflow-hidden rounded-3xl border-border/50 p-6 lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center text-center">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full border-4 ${status.bg} ${status.color}`}>
              <div>
                <p className="text-4xl font-bold">{aqiValue}</p>
                <p className="text-xs font-medium">AQI</p>
              </div>
            </div>
            <p className={`mt-3 text-lg font-semibold ${status.color}`}>{status.label}</p>
            <p className="text-sm text-muted-foreground">{status.desc}</p>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              San Francisco, CA
            </div>

            <div className="relative overflow-hidden rounded-full border border-border/60">
              <div className="flex h-4">
                <div className="w-1/4 bg-green-400/85" />
                <div className="w-1/4 bg-yellow-400/85" />
                <div className="w-1/4 bg-orange-400/85" />
                <div className="w-1/4 bg-red-500/85" />
              </div>
              <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow" style={{ left: `calc(${markerLeftPercent}% - 8px)` }} />
            </div>

            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy</span>
              <span>Hazardous</span>
            </div>

            <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-border/60 bg-card/55 text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              Map view placeholder for live AQI API
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pollutants.map((pollutant, index) => (
          <motion.article
            key={pollutant.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-3xl border-border/50 p-4 text-center"
          >
            <pollutant.icon className={`mx-auto mb-2 h-6 w-6 ${pollutant.color}`} />
            <p className="text-sm font-semibold">{pollutant.name}</p>
            <p className="mt-1 text-xl font-bold">{pollutant.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pollutant.status}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="glass-card rounded-3xl border-border/50 p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Hourly AQI Trend</h2>
          <div className="grid h-52 grid-cols-6 items-end gap-3 rounded-2xl border border-border/60 bg-card/45 p-4">
            {hourlyTrend.map((item) => (
              <div key={item.hour} className="flex h-full flex-col justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.round((item.value / hourlyMax) * 100)}%` }}
                  transition={{ duration: 0.6 }}
                  className="min-h-4 rounded-t-md bg-health-cyan/85"
                />
                <p className="mt-2 text-center text-[11px] text-muted-foreground">{item.hour}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <ShieldAlert className="h-5 w-5 text-health-cyan" />
            Health Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((tip) => (
              <div key={tip} className="rounded-2xl border border-border/60 bg-card/55 p-3 text-sm leading-relaxed text-muted-foreground">
                {tip}
              </div>
            ))}
          </div>
        </article>
      </section>
    </AppLayout>
  );
};

export default Aqi;
