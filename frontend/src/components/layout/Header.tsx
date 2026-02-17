import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Camera,
  UtensilsCrossed,
  Leaf,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Stories", href: "/stories", icon: BookOpen },
  { name: "Photos", href: "/photos", icon: Camera },
  { name: "Food", href: "/food", icon: UtensilsCrossed },
  { name: "Specialties", href: "/specialties", icon: Leaf },
];

export function Header() {
  const location = useLocation();

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="village-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-semibold text-foreground">
                  The Villagers
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Preserving Village Culture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex">
              <Link to="/stories">
                <Button variant="hero">
                  <MapPin className="w-4 h-4" />
                  Find Your Village
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border backdrop-blur-md">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center justify-center text-xs"
              >
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "mt-1",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
