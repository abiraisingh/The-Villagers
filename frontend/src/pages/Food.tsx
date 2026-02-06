import { Layout } from "@/components/layout/Layout";
import { UtensilsCrossed, MapPin, Clock, Users, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for recipes
const recipes = [
  {
    id: 1,
    title: "Bisi Bele Bath",
    description: "A traditional Karnataka rice dish made with lentils, vegetables, and a special spice blend.",
    village: "Mysore",
    prepTime: "45 mins",
    servings: 4,
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "Sattu Paratha",
    description: "Stuffed flatbread with roasted gram flour, a staple from Bihar villages.",
    village: "Patna",
    prepTime: "30 mins",
    servings: 6,
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "Pithla Bhakri",
    description: "Simple Maharashtrian dish of gram flour curry served with millet bread.",
    village: "Kolhapur",
    prepTime: "25 mins",
    servings: 4,
    difficulty: "Easy",
  },
  {
    id: 4,
    title: "Kootu Curry",
    description: "Kerala style vegetable and lentil stew with coconut, a temple offering staple.",
    village: "Thrissur",
    prepTime: "40 mins",
    servings: 6,
    difficulty: "Medium",
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-secondary/10 text-secondary",
  Medium: "bg-accent/20 text-accent-foreground",
  Hard: "bg-primary/10 text-primary",
};

export default function Food() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-12 lg:py-16 border-b border-border">
        <div className="village-container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Traditional Food</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Recipes from Grandma's Kitchen
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Authentic recipes passed down through generations. Cook the dishes 
                that tell the story of your village.
              </p>
            </div>
            <Button variant="accent" size="lg">
              <Plus className="w-4 h-4" />
              Share Recipe
            </Button>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12 lg:py-16">
        <div className="village-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="group village-card cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Difficulty Badge */}
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                    {recipe.difficulty}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-accent" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {recipe.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {recipe.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {recipe.village}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings} servings
                  </span>
                  <ChevronRight className="w-5 h-5 ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Recipes
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
