import { useEffect, useState } from "react";
import { Bell, Globe, Info, LockKeyhole, Moon, Shield, SlidersHorizontal, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@/lib/authContext";
import { apiClient } from "@/lib/apiClient";

type UserSettingsResponse = {
  id: number;
  user_id: number;
  theme: string;
  units: string;
  notifications_enabled: boolean;
  email_alerts_enabled: boolean;
  community_visibility: string;
  location_access_for_aqi: boolean;
};

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [communityVisibility, setCommunityVisibility] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);

  // Load user settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiClient.get<UserSettingsResponse>("/auth/settings");
        if (response.error || !response.data) {
          throw new Error(response.error || "Failed to load settings");
        }

        setPushNotifications(response.data.notifications_enabled ?? true);
        setEmailNotifications(response.data.email_alerts_enabled ?? true);
        setLocationAccess(response.data.location_access_for_aqi ?? true);
        setCommunityVisibility(response.data.community_visibility === "public");
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = async (settingKey: string, value: boolean) => {
    try {
      const updatePayload: Record<string, unknown> = {};

      if (settingKey === "notifications") {
        setPushNotifications(value);
        updatePayload.notifications_enabled = value;
      } else if (settingKey === "email_alerts") {
        setEmailNotifications(value);
        updatePayload.email_alerts_enabled = value;
      } else if (settingKey === "location_aqi") {
        setLocationAccess(value);
        updatePayload.location_access_for_aqi = value;
      } else if (settingKey === "community_visibility") {
        setCommunityVisibility(value);
        updatePayload.community_visibility = value ? "public" : "friends";
      }

      const response = await apiClient.patch<UserSettingsResponse>("/auth/settings", updatePayload);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppLayout title="Settings" subtitle="Manage app preferences, privacy controls, and account behavior.">
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            App Preferences
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                {theme === "dark" ? <Moon className="h-4 w-4 text-health-indigo" /> : <Sun className="h-4 w-4 text-amber-500" />}
                Dark Mode
              </span>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={toggleTheme}>
                {theme === "dark" ? "On" : "Off"}
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <label className="mb-1 block text-xs text-muted-foreground">Language</label>
              <select className="h-9 w-full appearance-none rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <label className="mb-1 block text-xs text-muted-foreground">Unit System</label>
              <select className="h-9 w-full appearance-none rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
          </div>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Bell className="h-5 w-5 text-health-violet" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Push Notifications",
                value: pushNotifications,
                onToggle: () => handleToggle("notifications", !pushNotifications),
              },
              {
                label: "Email Summaries",
                value: emailNotifications,
                onToggle: () => handleToggle("email_alerts", !emailNotifications),
              },
              {
                label: "Medication Reminders",
                value: medicationReminders,
                onToggle: () => setMedicationReminders((prev) => !prev),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
                <span className="text-sm">{item.label}</span>
                <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={item.onToggle}>
                  {item.value ? "On" : "Off"}
                </Button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Shield className="h-5 w-5 text-health-teal" />
            Privacy & Security
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Two-Factor Authentication",
                value: twoFactor,
                onToggle: () => setTwoFactor((prev) => !prev),
              },
              {
                label: "Community Profile Visibility",
                value: communityVisibility,
                onToggle: () => handleToggle("community_visibility", !communityVisibility),
              },
              {
                label: "Location Access for AQI",
                value: locationAccess,
                onToggle: () => handleToggle("location_aqi", !locationAccess),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
                <span className="text-sm">{item.label}</span>
                <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs" onClick={item.onToggle}>
                  {item.value ? "On" : "Off"}
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-xl text-sm"
              onClick={() => navigate("/about")}
            >
              <Info className="h-4 w-4" />
              About & Privacy
            </Button>
          </div>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <LockKeyhole className="h-5 w-5 text-health-cyan" />
            Account & Data
          </h2>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <label className="mb-1 block text-xs text-muted-foreground">Time Zone</label>
              <select className="h-9 w-full appearance-none rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                <option>Asia/Kolkata</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/55 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-primary" />
                Sync data on mobile network
              </span>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-3 text-xs">
                Enabled
              </Button>
            </div>
            <Button
              type="button"
              className="h-10 w-full rounded-xl bg-red-600/20 text-red-500 text-sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </article>
      </section>
    </AppLayout>
  );
};

export default Settings;
