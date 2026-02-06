import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 texture-grain" />

      <div className="village-container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-8">
            <Heart className="w-4 h-4" />
            <span>Join the Movement</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Your Village Needs You
          </h2>
          
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Elders hold wisdom that can't be Googled. Recipes exist only in 
            memory. Traditions are fading. Be the one who preserves them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link to="/stories">
                Start Contributing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-8">
            No sign-up needed to explore. Create an account only when you're ready to contribute.
          </p>
        </div>
      </div>
    </section>
  );
}
