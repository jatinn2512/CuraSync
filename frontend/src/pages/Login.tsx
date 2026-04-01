import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLogin = () => {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    timeoutRef.current = window.setTimeout(() => {
      navigate("/user-home");
    }, 620);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-bg-hero px-4 py-10">
      <div className="absolute left-8 top-14 h-72 w-72 rounded-full bg-health-cyan/20 blur-3xl" />
      <div className="absolute bottom-10 right-8 h-96 w-96 rounded-full bg-health-violet/20 blur-3xl" />
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle compact />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl glass-card p-7 sm:p-8"
      >
        <button
          type="button"
          className="mb-6 flex items-center gap-2.5 font-display text-lg font-bold"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl glow-primary gradient-bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Health Companion</span>
        </button>

        <h1 className="text-3xl font-bold text-balance">Welcome Back</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign in to continue tracking your health journey.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-input bg-card/65 px-3 py-2.5 text-sm outline-none ring-ring transition focus:border-primary/50 focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full rounded-xl border border-input bg-card/65 px-3 py-2.5 text-sm outline-none ring-ring transition focus:border-primary/50 focus:ring-2"
            />
          </div>

          <Button
            type="button"
            className="h-11 w-full gap-2 border-0 text-base gradient-bg-primary text-primary-foreground"
            onClick={handleLogin}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your dashboard
              </>
            ) : (
              <>
                Log In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <motion.div
            initial={false}
            animate={{
              opacity: isSigningIn ? 1 : 0,
              y: isSigningIn ? 0 : -6,
              height: isSigningIn ? "auto" : 0,
            }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-xs font-medium text-primary">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Sign in successful. Launching your personalized workspace.
              </span>
            </div>
          </motion.div>
        </form>

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-health-teal" />
          End-to-end encrypted and HIPAA compliant.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
