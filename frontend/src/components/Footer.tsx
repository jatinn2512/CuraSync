import { Activity } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance"],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              AI Health Companion
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your intelligent partner for a healthier, happier life.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold mb-4 text-sm">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AI Health Companion. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
