import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-sunset opacity-20" />

      {/* Texture overlay */}
      <div className="absolute inset-0 texture-grain" />

      <div className="village-container relative py-20 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <MapPin className="w-4 h-4" />
            <span>Celebrating Village Heritage</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up delay-100">
            Every Village Has a{" "}
            <span className="text-gradient-hero">Story Worth Telling</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up delay-200">
            Preserve and share the rich culture, traditions, recipes, and
            natural beauty of your village. Connect with your roots and inspire
            others.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/explore">
                <MapPin className="w-5 h-5" />
                Explore Villages
              </Link>
            </Button>

            <Button variant="outline" size="xl" asChild>
              <Link to="/stories">
                Share Your Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-border animate-fade-up delay-400">
            {[
              { value: "500+", label: "Villages" },
              { value: "2.5K+", label: "Stories" },
              { value: "10K+", label: "Photos" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
