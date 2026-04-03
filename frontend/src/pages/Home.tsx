import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  ClipboardList,
  Clock,
  Cpu,
  Fingerprint,
  Heart,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImg from "@/assets/hero-health-ai.png";

const features = [
  {
    icon: Stethoscope,
    title: "Symptom Checker",
    description:
      "AI-powered symptom analysis that helps you understand what your body is telling you.",
    color: "bg-health-teal/10 text-health-teal",
  },
  {
    icon: Brain,
    title: "Personalized Insights",
    description:
      "Get tailored health recommendations based on your unique profile and medical history.",
    color: "bg-health-cyan/10 text-health-cyan",
  },
  {
    icon: Activity,
    title: "Wellness Tracking",
    description:
      "Monitor daily health metrics, nutrition, sleep, and activity in one unified dashboard.",
    color: "bg-health-indigo/10 text-health-indigo",
  },
  {
    icon: Heart,
    title: "Mental Health Support",
    description:
      "Access guided exercises, mood tracking, and AI-assisted mental wellness resources.",
    color: "bg-health-rose/10 text-health-rose",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Never miss a medication, appointment, or wellness check with intelligent notifications.",
    color: "bg-health-violet/10 text-health-violet",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Your health data is encrypted end-to-end. We follow strict HIPAA compliance standards.",
    color: "bg-health-teal/10 text-health-teal",
  },
];

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Input Your Data",
    description:
      "Enter your symptoms, vitals, or health questions through our simple interface.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description:
      "Our advanced AI processes your data using millions of medical data points.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Insights",
    description:
      "Receive clear, actionable health insights personalized to your profile.",
  },
  {
    icon: Zap,
    step: "04",
    title: "Take Action",
    description:
      "Follow recommendations, track progress, and achieve your wellness goals.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "24/7 Convenience",
    description:
      "Access health guidance anytime, anywhere - no waiting rooms or appointments needed.",
  },
  {
    icon: Target,
    title: "Clinical Accuracy",
    description:
      "Built on medical research databases with continuous learning from verified health data.",
  },
  {
    icon: Fingerprint,
    title: "Hyper-Personalized",
    description:
      "Every recommendation is tailored to your unique health profile, lifestyle, and goals.",
  },
  {
    icon: HeartPulse,
    title: "Preventive Care",
    description:
      "Catch potential issues early with proactive monitoring and predictive health analytics.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Fitness Enthusiast",
    avatar: "SM",
    text: "AI Health Companion completely changed how I manage my wellness. The symptom checker saved me an unnecessary ER visit - it guided me to the right specialist instead.",
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const navigate = useNavigate();

  const goToSection = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <Navbar onSectionClick={goToSection} />

      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden gradient-bg-hero pt-16">
          <div className="absolute left-10 top-20 h-72 w-72 animate-pulse_glow rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute bottom-20 right-10 h-96 w-96 animate-pulse_glow rounded-full bg-accent/10 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />

          <div className="container relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center lg:text-left"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-primary glass-card">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Health Intelligence
                </div>

                <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Your Personal <span className="gradient-text">AI Health</span> Partner
                </h1>

                <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
                  Track symptoms, receive personalized insights, and take control of your wellness journey - all powered by advanced artificial intelligence.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button
                    size="lg"
                    className="gap-2 border-0 px-8 text-base glow-primary gradient-bg-primary text-primary-foreground"
                    onClick={() => navigate("/login")}
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 px-8 text-base"
                    onClick={() => goToSection("features")}
                  >
                    Learn More
                  </Button>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-health-teal" />
                    10k+ Active Users
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-health-cyan" />
                    HIPAA Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-health-violet" />
                    24/7 Support
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 scale-75 rounded-full opacity-20 blur-3xl gradient-bg-primary" />
                  <img
                    src={heroImg}
                    alt="AI Health Companion - smart health assistant interface"
                    className="relative z-10 w-full max-w-md animate-float lg:max-w-lg"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-background py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Powerful <span className="gradient-text">Features</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Everything you need to take control of your health, powered by cutting-edge AI technology.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={item}
                  className="group rounded-2xl p-6 glass-card hover-lift"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="bg-muted/40 py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                How It <span className="gradient-text-accent">Works</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                From input to action in four simple steps - your health journey starts here.
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {index < steps.length - 1 && (
                    <div className="absolute left-[60%] top-10 hidden h-px w-[80%] bg-border lg:block" />
                  )}

                  <div className="relative z-10 mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl glow-primary gradient-bg-primary">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Step {step.step}
                  </span>
                  <h3 className="mb-2 mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-background py-24">
          <div className="container">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                  Why Choose <span className="gradient-text">AI Health Companion</span>?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  We combine the precision of artificial intelligence with the compassion of personalized care to deliver a health experience unlike any other.
                </p>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl gradient-bg-primary">
                        <benefit.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
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
                <div className="space-y-6 rounded-3xl p-8 glass-card">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg-accent">
                      <HeartPulse className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Health Score</p>
                      <p className="text-sm text-muted-foreground">Your overall wellness</p>
                    </div>
                    <span className="ml-auto text-3xl font-bold gradient-text">92</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Physical", pct: 88, color: "bg-health-teal" },
                      { label: "Mental", pct: 94, color: "bg-health-cyan" },
                      { label: "Nutrition", pct: 78, color: "bg-health-violet" },
                      { label: "Sleep", pct: 91, color: "bg-health-indigo" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-medium">{metric.pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={`h-full rounded-full ${metric.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${metric.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-muted/40 py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Loved by <span className="gradient-text-accent">Thousands</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Hear from real users who transformed their health journey.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="rounded-2xl p-6 glass-card hover-lift"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-4 w-4 fill-health-teal text-health-teal"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-foreground/90">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground gradient-bg-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl p-12 text-center gradient-bg-primary md:p-16"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)] dark:bg-none" />
              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                  Start Your Health Journey Today
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
                  Join thousands of users who are already taking control of their health with the power of AI. It is free to get started.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="gap-2 bg-background px-8 text-base text-foreground hover:bg-background/90"
                    onClick={() => navigate("/login")}
                  >
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => navigate("/login")}
                  >
                    Talk to Us
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
