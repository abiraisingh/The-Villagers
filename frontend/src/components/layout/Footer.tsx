import { Link } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="village-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                The Villagers
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              A community platform dedicated to preserving and celebrating the rich 
              cultural heritage of villages across India. Share stories, recipes, 
              and traditions that make your village unique.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Stories", href: "/stories" },
                { name: "Photos", href: "/photos" },
                { name: "Food & Recipes", href: "/food" },
                { name: "Specialties", href: "/specialties" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Guidelines", href: "/guidelines" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 The Villagers. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for our villages
          </p>
        </div>
      </div>
    </footer>
  );
}
