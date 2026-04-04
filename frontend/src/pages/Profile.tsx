import { useState } from "react";
import { Bell, Moon, Save, Settings, Shield, Sun, Target, User } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import useTheme from "@/hooks/useTheme";

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <AppLayout title="Profile" subtitle="Update personal details, manage goals, and configure preferences.">
      <section className="space-y-6">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5 text-primary" />
            Personal Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Full Name</span>
              <input defaultValue="John Doe" className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25" />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Age</span>
              <input defaultValue="32" className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25" />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Height</span>
              <input defaultValue={"5'10\""} className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25" />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Weight</span>
              <input defaultValue="175 lbs" className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25" />
            </label>
          </div>
          <Button type="button" className="mt-4 h-10 rounded-xl bg-primary px-4 text-primary-foreground">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 text-xl font-semibold">Health Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "BMI", value: "24.1", status: "Normal" },
              { label: "Avg Sleep", value: "7.2h", status: "Good" },
              { label: "Activity", value: "High", status: "Excellent" },
            ].map((summary) => (
              <div key={summary.label} className="rounded-2xl border border-border/60 bg-card/55 p-4 text-center">
                <p className="text-2xl font-bold">{summary.value}</p>
                <p className="text-xs text-muted-foreground">{summary.label}</p>
                <p className="mt-1 text-xs font-medium text-primary">{summary.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Target className="h-5 w-5 text-health-cyan" />
            Goals
          </h2>
          <div className="space-y-4">
            {[
              { label: "Daily Steps", current: 8432, target: 10000 },
              { label: "Weight Goal", current: 175, target: 165 },
              { label: "Weekly Workouts", current: 4, target: 5 },
            ].map((goal) => (
              <div key={goal.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>{goal.label}</span>
                  <span className="text-muted-foreground">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Settings
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <div className="flex items-center gap-3 text-sm">
                {theme === "dark" ? <Moon className="h-5 w-5 text-health-indigo" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                Dark Mode
              </div>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={toggleTheme}>
                {theme === "dark" ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <div className="flex items-center gap-3 text-sm">
                <Bell className="h-5 w-5 text-health-violet" />
                Push Notifications
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-lg px-3 text-xs"
                onClick={() => setNotifications((prev) => !prev)}
              >
                {notifications ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-health-teal" />
                Two-Factor Authentication
              </div>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={() => setTwoFactor((prev) => !prev)}>
                {twoFactor ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </article>
      </section>
    </AppLayout>
  );
};

export default Profile;
