import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance"],
};

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-card/50 py-16">
      <div className="container">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div>
            <button
              type="button"
              className="mb-4 flex items-center gap-2 font-display text-lg font-bold"
              onClick={() => navigate("/")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              AI Health Companion
            </button>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your intelligent partner for a healthier, happier life.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Copyright {new Date().getFullYear()} AI Health Companion. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
