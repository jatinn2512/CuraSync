import { motion } from "framer-motion";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-bg-hero px-4 py-10">
      <div className="absolute left-8 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-16 right-8 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl glass-card p-7 sm:p-8"
      >
        <button
          type="button"
          className="mb-6 flex items-center gap-2 font-display text-lg font-bold"
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Health Companion</span>
        </button>

        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
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
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition focus:ring-2"
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
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition focus:ring-2"
            />
          </div>

          <Button
            type="button"
            className="h-11 w-full gap-2 text-base gradient-bg-primary text-primary-foreground"
            onClick={() => navigate("/user-home")}
          >
            Log In <ArrowRight className="h-4 w-4" />
          </Button>
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
