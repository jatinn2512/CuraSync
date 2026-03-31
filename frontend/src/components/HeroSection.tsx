import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-health-ai.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-bg-hero overflow-hidden pt-16">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse_glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse_glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Health Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Your Personal{" "}
              <span className="gradient-text">AI Health</span>{" "}
              Partner
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Track symptoms, receive personalized insights, and take control of your wellness journey — all powered by advanced artificial intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gradient-bg-primary text-primary-foreground border-0 gap-2 glow-primary text-base px-8">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-health-teal" />
                10k+ Active Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-health-cyan" />
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-health-violet" />
                24/7 Support
              </span>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-bg-primary rounded-full blur-3xl opacity-20 scale-75" />
              <img
                src={heroImg}
                alt="AI Health Companion — smart health assistant interface"
                className="relative z-10 w-full max-w-md lg:max-w-lg animate-float"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
