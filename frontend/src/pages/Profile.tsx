import { motion } from "framer-motion";
import { Bell, Settings, Shield, UserCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const preferenceItems = [
  { label: "Medication reminders", icon: Bell, status: "Enabled" },
  { label: "Weekly health summary", icon: Settings, status: "Enabled" },
  { label: "Data sharing with doctors", icon: Shield, status: "Private" },
];

const profileRows = [
  { label: "Full Name", value: "Rahul Verma" },
  { label: "Email", value: "rahul.verma@example.com" },
  { label: "Age", value: "29" },
  { label: "Primary Goal", value: "Improve cardiovascular endurance" },
];

const Profile = () => {
  return (
    <AppLayout
      title="Profile"
      subtitle="Manage your account details, personal goals, and health app preferences in one place."
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 lg:col-span-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full gradient-bg-primary">
              <UserCircle2 className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Rahul Verma</h2>
            <p className="text-sm text-muted-foreground">Member since Jan 2026</p>
            <span className="mt-4 rounded-full bg-health-teal/10 px-3 py-1 text-xs font-semibold text-health-teal">
              Premium Plan
            </span>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">Account Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profileRows.map((row) => (
              <div key={row.label} className="rounded-xl border border-border/60 bg-card/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
                <p className="mt-1 text-sm font-medium">{row.value}</p>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="mb-4 text-xl font-semibold">Preferences</h2>
        <div className="space-y-3">
          {preferenceItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card/70 p-4"
            >
              <span className="flex items-center gap-2 text-sm">
                <item.icon className="h-4 w-4 text-health-indigo" />
                {item.label}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{item.status}</span>
            </div>
          ))}
        </div>
      </motion.section>
    </AppLayout>
  );
};

export default Profile;
