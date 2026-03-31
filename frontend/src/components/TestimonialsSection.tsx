import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Fitness Enthusiast",
    avatar: "SM",
    text: "AI Health Companion completely changed how I manage my wellness. The symptom checker saved me an unnecessary ER visit — it guided me to the right specialist instead.",
    rating: 5,
  },
  {
    name: "James Rivera",
    role: "Software Engineer",
    avatar: "JR",
    text: "As someone who neglects health checkups, the smart reminders and daily tracking keep me accountable. My sleep quality has improved 40% in just two months.",
    rating: 5,
  },
  {
    name: "Dr. Priya Kapoor",
    role: "Family Physician",
    avatar: "PK",
    text: "I recommend this to my patients for between-visit monitoring. The AI insights are surprisingly accurate and help patients come to appointments better prepared.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-muted/40">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text-accent">Thousands</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from real users who transformed their health journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 hover-lift"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-health-teal text-health-teal" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
