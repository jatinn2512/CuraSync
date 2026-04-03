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
    <footer className="relative border-t border-border/70 bg-card/45 py-16 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/80" />
      <div className="container">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div>
            <button
              type="button"
              className="group mb-4 flex items-center gap-2.5 font-display text-lg font-bold"
              onClick={() => navigate("/")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 glow-primary gradient-bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              CuraSync
            </button>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your intelligent partner for a healthier, happier life.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold tracking-wide">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
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
            Copyright {new Date().getFullYear()} CuraSync. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
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
