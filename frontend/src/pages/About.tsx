import { FileText, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const About = () => {
  return (
    <AppLayout title="About & Privacy" subtitle="How CuraSync handles your health information and platform usage.">
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            About CuraSync
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            CuraSync is a health companion workspace designed to help you track vitals, nutrition, air quality, and
            overall wellness. We focus on clarity, daily consistency, and simple health actions that are easy to
            follow.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Insights shown in the app are supportive suggestions and should not replace professional medical advice.
          </p>
        </article>

        <article className="glass-card rounded-3xl border-border/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck className="h-5 w-5 text-health-teal" />
            Privacy Policy (Short)
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Your personal health data is not sold to third parties. Data stays in your app workflow and is used only
              to provide features you actively use.
            </p>
            <p>
              We do not publish your private logs, symptoms, or profile details publicly without your explicit action.
            </p>
            <p>
              Sensitive account and health records are handled with security controls and encrypted storage practices.
            </p>
            <p>
              You can manage visibility options from Settings at any time.
            </p>
          </div>
        </article>
      </section>
    </AppLayout>
  );
};

export default About;
