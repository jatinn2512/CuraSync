import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";

type BillingCycle = "monthly" | "yearly";

type PricingPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
};

const plans: PricingPlan[] = [
  {
    id: "current",
    name: "Current Plan",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Your existing basic access plan.",
    features: ["Dashboard overview", "Health, food and AQI basics", "Community access"],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 299,
    yearlyPrice: 3289,
    description: "Advanced AI recommendations and premium insights.",
    features: ["Everything in Current Plan", "Advanced AI food guidance", "Priority recommendations", "Detailed trend reports"],
    popular: true,
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const ctaText = useMemo(() => (billingCycle === "monthly" ? "Choose Monthly" : "Choose Yearly"), [billingCycle]);

  return (
    <AppLayout title="Pricing" centerHeader>
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex rounded-xl border border-border/60 bg-card/55 p-1">
            <Button
              type="button"
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              className="h-9 rounded-lg px-4"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              type="button"
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              className="h-9 rounded-lg px-4"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {plans.map((plan, index) => {
            const activePrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const subLabel = billingCycle === "monthly" ? "/month" : "/year";

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card flex min-h-[440px] flex-col rounded-3xl border p-6 ${plan.popular ? "border-primary/70" : "border-border/50"}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  {plan.popular ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Crown className="h-3.5 w-3.5" />
                      Popular
                    </span>
                  ) : null}
                </div>

                <div className="mb-4 rounded-2xl border border-border/60 bg-card/60 p-4">
                  <p className="text-3xl font-extrabold">
                    ₹{activePrice.toLocaleString("en-IN")}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">{subLabel}</span>
                  </p>
                </div>

                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  variant={plan.current ? "outline" : "default"}
                  className={`h-11 w-full rounded-xl ${plan.current ? "border-border/60" : "bg-primary text-primary-foreground"}`}
                >
                  {plan.current ? "Current Plan" : ctaText}
                </Button>
              </motion.article>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
};

export default Pricing;
