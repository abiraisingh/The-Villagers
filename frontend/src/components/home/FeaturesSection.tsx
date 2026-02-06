import { BookOpen, Camera, UtensilsCrossed, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BookOpen,
    title: "Village Stories",
    description:
      "Share tales of traditions, festivals, and the unique history that makes your village special.",
    href: "/stories",
    color: "primary" as const,
  },
  {
    icon: Camera,
    title: "Nature & Places",
    description:
      "Capture the beauty of fields, temples, forests, and architecture. No faces, just places.",
    href: "/photos",
    color: "secondary" as const,
  },
  {
    icon: UtensilsCrossed,
    title: "Traditional Food",
    description:
      "Document authentic recipes passed down through generations. Keep culinary heritage alive.",
    href: "/food",
    color: "accent" as const,
  },
  {
    icon: Leaf,
    title: "Local Specialties",
    description:
      "Showcase unique crops, fruits, and produce that your village is known for.",
    href: "/specialties",
    color: "secondary" as const,
  },
];

const colorVariants = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  secondary: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground",
  accent: "bg-accent/20 text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground",
};

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="village-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Preserve What Matters
          </h2>
          <p className="text-muted-foreground text-lg">
            Four pillars of village culture, all in one place. No influencers, 
            no engagement hacks—just authentic preservation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group village-card flex flex-col items-start hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${colorVariants[feature.color]}`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
