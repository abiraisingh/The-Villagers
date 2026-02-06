import { Layout } from "@/components/layout/Layout";
import { Leaf, MapPin, Plus, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for specialties
const specialties = [
  {
    id: 1,
    name: "Alphonso Mango",
    description: "The king of mangoes, known for its rich, creamy texture and sweet aroma. Best harvested in April-May.",
    village: "Ratnagiri",
    state: "Maharashtra",
    season: "Summer",
    rating: 4.9,
    category: "Fruit",
  },
  {
    id: 2,
    name: "Basmati Rice",
    description: "Long-grain aromatic rice with distinctive fragrance. Grown in the foothills of the Himalayas.",
    village: "Dehradun",
    state: "Uttarakhand",
    season: "Monsoon",
    rating: 4.8,
    category: "Grain",
  },
  {
    id: 3,
    name: "Naga Chilli",
    description: "One of the world's hottest peppers, used sparingly in traditional Naga cuisine.",
    village: "Kohima",
    state: "Nagaland",
    season: "Autumn",
    rating: 4.7,
    category: "Vegetable",
  },
  {
    id: 4,
    name: "Kesar Saffron",
    description: "Premium saffron known as 'red gold', hand-picked from the fields of Kashmir.",
    village: "Pampore",
    state: "Kashmir",
    season: "Autumn",
    rating: 5.0,
    category: "Spice",
  },
  {
    id: 5,
    name: "Coorg Orange",
    description: "Sweet and juicy oranges grown in the misty hills of Coorg.",
    village: "Madikeri",
    state: "Karnataka",
    season: "Winter",
    rating: 4.6,
    category: "Fruit",
  },
  {
    id: 6,
    name: "Darjeeling Tea",
    description: "The champagne of teas, with its distinctive muscatel flavor and golden color.",
    village: "Darjeeling",
    state: "West Bengal",
    season: "Spring",
    rating: 4.9,
    category: "Beverage",
  },
];

const categoryColors: Record<string, string> = {
  Fruit: "bg-accent/20 text-accent-foreground",
  Grain: "bg-primary/10 text-primary",
  Vegetable: "bg-secondary/10 text-secondary",
  Spice: "bg-destructive/10 text-destructive",
  Beverage: "bg-secondary/10 text-secondary",
};

const seasonColors: Record<string, string> = {
  Summer: "text-accent",
  Monsoon: "text-secondary",
  Autumn: "text-primary",
  Winter: "text-muted-foreground",
  Spring: "text-secondary",
};

export default function Specialties() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-12 lg:py-16 border-b border-border">
        <div className="village-container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Leaf className="w-4 h-4" />
                <span>Local Specialties</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Pride of the Land
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Unique crops, fruits, and produce that each village is famous for. 
                Celebrate what your land grows best.
              </p>
            </div>
            <Button variant="nature" size="lg">
              <Plus className="w-4 h-4" />
              Add Specialty
            </Button>
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-12 lg:py-16">
        <div className="village-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((item, index) => (
              <article
                key={item.id}
                className="group village-card cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Category Badge */}
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium text-foreground">{item.rating}</span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Location & Season */}
                <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {item.village}, {item.state}
                    </span>
                    <span className={`font-medium ${seasonColors[item.season]}`}>
                      {item.season} Season
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Explore More Specialties
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
