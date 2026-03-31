import { motion } from "framer-motion";
import { Stethoscope, Brain, Activity, Heart, Bell, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Symptom Checker",
    description: "AI-powered symptom analysis that helps you understand what your body is telling you.",
    color: "bg-health-teal/10 text-health-teal",
  },
  {
    icon: Brain,
    title: "Personalized Insights",
    description: "Get tailored health recommendations based on your unique profile and medical history.",
    color: "bg-health-cyan/10 text-health-cyan",
  },
  {
    icon: Activity,
    title: "Wellness Tracking",
    description: "Monitor daily health metrics, nutrition, sleep, and activity in one unified dashboard.",
    color: "bg-health-indigo/10 text-health-indigo",
  },
  {
    icon: Heart,
    title: "Mental Health Support",
    description: "Access guided exercises, mood tracking, and AI-assisted mental wellness resources.",
    color: "bg-health-rose/10 text-health-rose",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a medication, appointment, or wellness check with intelligent notifications.",
    color: "bg-health-violet/10 text-health-violet",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "Your health data is encrypted end-to-end. We follow strict HIPAA compliance standards.",
    color: "bg-health-teal/10 text-health-teal",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to take control of your health, powered by cutting-edge AI technology.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-card rounded-2xl p-6 hover-lift group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
