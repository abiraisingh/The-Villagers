import { Layout } from "@/components/layout/Layout";
import { Leaf, MapPin, Plus, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Specialty {
  id: string;
  name: string;
  description?: string | null;
  type: string;       // backend field
  village: string;
  pincode: string;
  createdAt: string;
}

const typeColors: Record<string, string> = {
  Fruit: "bg-accent/20 text-accent-foreground",
  Grain: "bg-primary/10 text-primary",
  Vegetable: "bg-secondary/10 text-secondary",
  Spice: "bg-destructive/10 text-destructive",
  Beverage: "bg-secondary/10 text-secondary",
};

export default function Specialties() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH FROM BACKEND ---------------- */
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/specialties");
        if (!res.ok) throw new Error("Failed to fetch specialties");

        const data = await res.json();
        setSpecialties(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="village-container flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
              <Leaf className="w-4 h-4" />
              Local Specialties
            </div>
            <h1 className="font-serif text-4xl font-bold">
              Pride of the Land
            </h1>
            <p className="text-muted-foreground max-w-xl mt-2">
              Unique crops, fruits, and produce that villages are famous for.
            </p>
          </div>

          <Button
            variant="nature"
            size="lg"
            onClick={() => navigate("/specialties/add")}
          >
            <Plus className="w-4 h-4" />
            Add Specialty
          </Button>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="village-container">
          {loading && <p>Loading specialties...</p>}
          {error && <p className="text-destructive">{error}</p>}

          {!loading && !error && specialties.length === 0 && (
            <p className="text-muted-foreground">
              No specialties added yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((item, index) => (
              <article
                key={item.id}
                className="group village-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Type badge */}
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    typeColors[item.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.type}
                </span>

                <h2 className="font-serif text-xl font-semibold mb-2">
                  {item.name}
                </h2>

                {item.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {item.village}
                  </span>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
