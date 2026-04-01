import { motion } from "framer-motion";
import { MessageSquare, UserPlus, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const groups = [
  {
    name: "Weight Management Circle",
    members: "2.1k members",
    topic: "Healthy routines, meal consistency, and weekly accountability.",
  },
  {
    name: "Heart Health Hub",
    members: "1.4k members",
    topic: "Cardio fitness, blood pressure goals, and endurance support.",
  },
  {
    name: "Mental Wellness Space",
    members: "1.9k members",
    topic: "Mindfulness, stress reduction, and daily check-ins.",
  },
];

const Community = () => {
  return (
    <AppLayout
      title="Community"
      subtitle="Connect with people, share progress, and stay motivated with supportive health communities."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active Members", value: "5.4k", icon: Users },
          { label: "Daily Posts", value: "320", icon: MessageSquare },
          { label: "New Connections", value: "47", icon: UserPlus },
        ].map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-health-indigo" />
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {groups.map((group, index) => (
          <motion.article
            key={group.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 + 0.15 }}
            className="rounded-2xl p-6 glass-card"
          >
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p className="mt-1 text-xs text-health-teal">{group.members}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.topic}</p>
            <button
              type="button"
              className="mt-4 rounded-xl gradient-bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Join Group
            </button>
          </motion.article>
        ))}
      </section>
    </AppLayout>
  );
};

export default Community;
