import { motion } from "framer-motion";
import { ClipboardList, Cpu, BarChart3, Zap } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Input Your Data",
    description: "Enter your symptoms, vitals, or health questions through our simple interface.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI processes your data using millions of medical data points.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Insights",
    description: "Receive clear, actionable health insights personalized to your profile.",
  },
  {
    icon: Zap,
    step: "04",
    title: "Take Action",
    description: "Follow recommendations, track progress, and achieve your wellness goals.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/40">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="gradient-text-accent">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From input to action in four simple steps — your health journey starts here.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}

              <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl gradient-bg-primary flex items-center justify-center mb-5 glow-primary">
                <s.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Step {s.step}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
