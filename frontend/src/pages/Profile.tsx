import { useState, useEffect } from "react";
import { Save, Target, User } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/authContext";
import { apiClient } from "@/lib/apiClient";

type ProfileFormData = {
  full_name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  activity_level: string;
};

const toInputValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "moderate",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age ? String(user.age) : "",
        gender: user.gender || "",
        height_cm: toInputValue(user.profile?.height_cm),
        weight_kg: toInputValue(user.profile?.weight_kg),
        activity_level: user.profile?.activity_level || "moderate",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const payload: {
        full_name?: string;
        phone?: string;
        age?: number;
        gender?: string;
        height_cm?: number;
        weight_kg?: number;
        activity_level?: string;
      } = {};

      const fullName = formData.full_name.trim();
      const phone = formData.phone.trim();
      if (fullName) payload.full_name = fullName;
      if (phone) payload.phone = phone;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.activity_level) payload.activity_level = formData.activity_level;

      if (formData.age.trim()) {
        const parsedAge = Number(formData.age);
        if (Number.isNaN(parsedAge) || parsedAge < 18) {
          throw new Error("Age must be at least 18");
        }
        payload.age = parsedAge;
      }

      if (formData.height_cm.trim()) {
        const parsedHeight = Number(formData.height_cm);
        if (Number.isNaN(parsedHeight) || parsedHeight <= 0) {
          throw new Error("Height must be a valid positive number");
        }
        payload.height_cm = parsedHeight;
      }

      if (formData.weight_kg.trim()) {
        const parsedWeight = Number(formData.weight_kg);
        if (Number.isNaN(parsedWeight) || parsedWeight <= 0) {
          throw new Error("Weight must be a valid positive number");
        }
        payload.weight_kg = parsedWeight;
      }

      const response = await apiClient.updateProfile(payload);
      if (response.error || !response.data) {
        throw new Error(response.error || "Failed to update profile");
      }

      await refreshUser();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Profile" subtitle="Update personal details, manage goals, and configure preferences.">
      <section className="space-y-6">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5 text-primary" />
            Personal Info
          </h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              {success}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Full Name</span>
              <input
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Email</span>
              <input
                value={formData.email}
                disabled
                className="h-11 w-full rounded-xl border border-border/60 bg-card/50 px-3 outline-none opacity-60"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Phone Number</span>
              <input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Age</span>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Gender</span>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Height (cm)</span>
              <input
                type="number"
                value={formData.height_cm}
                onChange={(e) => handleInputChange("height_cm", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Weight (kg)</span>
              <input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="text-xs text-muted-foreground">Activity Level</span>
              <select
                value={formData.activity_level}
                onChange={(e) => handleInputChange("activity_level", e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-card px-3 outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </label>
          </div>

          <Button
            type="button"
            className="mt-4 h-10 rounded-xl bg-primary px-4 text-primary-foreground"
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
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
              { label: "Active Minutes", current: 42, target: 60 },
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

      </section>
    </AppLayout>
  );
};

export default Profile;
