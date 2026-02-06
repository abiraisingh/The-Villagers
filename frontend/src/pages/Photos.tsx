import { Layout } from "@/components/layout/Layout";
import { Camera, MapPin, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-village.jpg";

// Mock data for photos (using placeholder)
const photos = [
  { id: 1, title: "Rice Fields at Dawn", village: "Wayanad", category: "Fields" },
  { id: 2, title: "Ancient Temple Steps", village: "Thanjavur", category: "Temple" },
  { id: 3, title: "Village Well", village: "Jaisalmer", category: "Architecture" },
  { id: 4, title: "Monsoon Greenery", village: "Coorg", category: "Nature" },
  { id: 5, title: "Traditional Hut", village: "Sundarbans", category: "Architecture" },
  { id: 6, title: "Sunset Over Farms", village: "Punjab", category: "Fields" },
];

const categoryColors: Record<string, string> = {
  Fields: "bg-secondary/80",
  Temple: "bg-primary/80",
  Architecture: "bg-accent/80",
  Nature: "bg-secondary/80",
};

export default function Photos() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-12 lg:py-16 border-b border-border">
        <div className="village-container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Camera className="w-4 h-4" />
                <span>Village Photos</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Nature & Places
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Capturing the timeless beauty of village landscapes, temples, 
                farms, and traditional architecture.
              </p>
            </div>
            <Button variant="nature" size="lg">
              <Plus className="w-4 h-4" />
              Upload Photo
            </Button>
          </div>

          {/* Guidelines Notice */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Photo Guidelines:</strong> We celebrate nature and places, 
              not individuals. Please ensure no human faces are visible in uploaded photos. 
              Focus on fields, temples, architecture, and natural landscapes.
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12 lg:py-16">
        <div className="village-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Placeholder Image */}
                <img
                  src={heroImage}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground ${categoryColors[photo.category]}`}>
                  {photo.category}
                </span>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-1">
                    {photo.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {photo.village}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Photos
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
