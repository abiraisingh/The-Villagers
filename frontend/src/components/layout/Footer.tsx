import { Link } from "react-router-dom";
import { MapPin, Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto bg-gradient-to-br from-background via-card to-background border-t border-border">
      
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      <div className="village-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                The Villagers
              </span>
            </Link>

            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              A community-driven platform preserving the cultural heritage of 
              villages across India. Share authentic stories, traditions, 
              food, and memories that define your roots.
            </p>

            {/* Optional Newsletter */}
            <div className="mt-6 flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-muted text-sm outline-none focus:ring-2 focus:ring-primary w-full max-w-xs"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm">
                Subscribe
              </button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Stories", href: "/stories" },
                { name: "Photos", href: "/photos" },
                { name: "Food & Recipes", href: "/food" },
                { name: "Specialties", href: "/specialties" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="relative text-muted-foreground text-sm transition-colors hover:text-primary before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
              Community
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Guidelines", href: "/guidelines" },
                { name: "About Developer", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="relative text-muted-foreground text-sm transition-colors hover:text-primary before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 The Villagers. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              for our villages
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
