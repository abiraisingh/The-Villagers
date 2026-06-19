import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Camera,
  UtensilsCrossed,
  Leaf,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Stories", href: "/stories", icon: BookOpen },
  { name: "Photos", href: "/photos", icon: Camera },
  { name: "Food", href: "/food", icon: UtensilsCrossed },
  { name: "Specialties", href: "/specialties", icon: Leaf },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const userAvatar = typeof window !== 'undefined' ? localStorage.getItem('userAvatar') : null;
  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)
        .map((s) => s[0]?.toUpperCase())
        .slice(0, 2)
        .join("")
    : "U";

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

            {/* Mobile top-profile button (visible only on small screens) */}
            {token ? (
              <div className="md:hidden ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/profile" className="inline-flex items-center">
                      <Avatar className="h-8 w-8">
                        {userAvatar ? <AvatarImage src={userAvatar} alt={userEmail || 'User avatar'} /> : <AvatarFallback>{initials}</AvatarFallback>}
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Profile — {userEmail}</TooltipContent>
                </Tooltip>
              </div>
            ) : null}

            {/* Desktop / Tablet Navigation (show from md up) */}
            <div className="hidden md:flex md:items-center md:gap-2">
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

            {/* Desktop / Tablet CTA */}
            <div className="hidden md:flex items-center">
              <Link to="/stories">
                <Button variant="hero">
                  <MapPin className="w-4 h-4" />
                  Share Story
                </Button>
              </Link>
              {token ? (
                <div className="flex items-center ml-3 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/profile" className="inline-flex items-center">
                        <Avatar className="h-8 w-8">
                          {userAvatar ? <AvatarImage src={userAvatar} alt={userEmail || 'User avatar'} /> : <AvatarFallback>{initials}</AvatarFallback>}
                        </Avatar>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Profile — {userEmail}</TooltipContent>
                  </Tooltip>
                  <Button variant="outline" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userEmail'); navigate('/'); }}>
                  Logout
                  </Button>
                </div>
              ) : (
                <div className="ml-3 flex gap-2">
                  <Link to="/login"><Button variant="ghost">Log in</Button></Link>
                  <Link to="/register"><Button variant="secondary">Sign up</Button></Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Mobile Bottom Navigation (hide on md+) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border backdrop-blur-md">
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
