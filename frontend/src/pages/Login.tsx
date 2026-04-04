import { useState } from "react";
import { Activity, Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import heroImg from "@/assets/hero-health-ai.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onLogin = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    window.setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] px-4 py-8 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-start gap-10 lg:items-center lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="mx-auto max-w-md lg:max-w-lg">
            <img src={heroImg} alt="CuraSync assistant" className="mx-auto w-full max-w-[380px]" />
            <h1 className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-700 sm:text-xl">
              Login in to continue to track your health, routines and progress in one workspace.
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-[560px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <button
                  type="button"
                  className="mb-3 inline-flex items-center gap-2 text-left text-3xl font-bold leading-none text-slate-900 sm:text-[38px]"
                  onClick={() => navigate("/")}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700">
                    <Activity className="h-6 w-6 text-white" />
                  </span>
                  CuraSync
                </button>
                <h2 className="text-4xl font-bold leading-none text-slate-900 sm:text-[46px]">Sign In</h2>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                onClick={() => navigate("/")}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-300 px-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-300 px-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="text-slate-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="button" className="text-sm font-semibold text-emerald-700 hover:underline">
                Forgot Password?
              </button>

              <Button
                type="button"
                className="h-12 w-full rounded-full border-0 bg-emerald-700 text-lg font-semibold text-white hover:bg-emerald-800"
                onClick={onLogin}
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing in..." : "Sign in"}
              </Button>

              <Button
                type="button"
                onClick={() => {}}
                aria-disabled="true"
                className="h-12 w-full rounded-full border border-emerald-700 bg-white text-lg font-semibold text-emerald-800 hover:bg-white"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.65z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3a7.2 7.2 0 0 1-10.73-3.78H1.34v3.08A12 12 0 0 0 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.34 14.32a7.2 7.2 0 0 1 0-4.58V6.66H1.34a12 12 0 0 0 0 10.74l4-3.08z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.43-3.43A11.48 11.48 0 0 0 12 0 12 12 0 0 0 1.34 6.66l4 3.08A7.2 7.2 0 0 1 12 4.77z"
                  />
                </svg>
                Sign in with Google (Disabled)
              </Button>

              <p className="text-sm text-slate-600">
                New to CuraSync?{" "}
                <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
