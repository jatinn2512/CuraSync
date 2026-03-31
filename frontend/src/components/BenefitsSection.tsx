import { motion } from "framer-motion";
import { Clock, Target, Fingerprint, HeartPulse } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "24/7 Convenience",
    description: "Access health guidance anytime, anywhere — no waiting rooms or appointments needed.",
  },
  {
    icon: Target,
    title: "Clinical Accuracy",
    description: "Built on medical research databases with continuous learning from verified health data.",
  },
  {
    icon: Fingerprint,
    title: "Hyper-Personalized",
    description: "Every recommendation is tailored to your unique health profile, lifestyle, and goals.",
  },
  {
    icon: HeartPulse,
    title: "Preventive Care",
    description: "Catch potential issues early with proactive monitoring and predictive health analytics.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">AI Health Companion</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We combine the precision of artificial intelligence with the compassion of personalized care to deliver a health experience unlike any other.
            </p>
            <div className="space-y-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl gradient-bg-primary flex-shrink-0 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg-accent flex items-center justify-center">
                  <HeartPulse className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Health Score</p>
                  <p className="text-muted-foreground text-sm">Your overall wellness</p>
                </div>
                <span className="ml-auto text-3xl font-bold gradient-text">92</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Physical", pct: 88, color: "bg-health-teal" },
                  { label: "Mental", pct: 94, color: "bg-health-cyan" },
                  { label: "Nutrition", pct: 78, color: "bg-health-violet" },
                  { label: "Sleep", pct: 91, color: "bg-health-indigo" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-medium">{m.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${m.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
