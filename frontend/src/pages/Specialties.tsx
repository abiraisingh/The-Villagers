/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "@/components/layout/Layout";
import { Leaf, MapPin, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Specialty {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  village: string;
  pincode: string;
  createdAt: string;
  isDemo?: boolean;
}

const typeColors: Record<string, string> = {
  Fruit: "bg-accent/20 text-accent-foreground",
  Grain: "bg-primary/10 text-primary",
  Vegetable: "bg-secondary/10 text-secondary",
  Spice: "bg-destructive/10 text-destructive",
  Beverage: "bg-secondary/10 text-secondary",
};

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- MOCK DATA ---------------- */

const MOCK_SPECIALTIES: Specialty[] = [
  {
    id: "demo-1",
    name: "Basmati Rice",
    description:
      "Premium long-grain aromatic rice cultivated in fertile plains.",
    type: "Grain",
    village: "Karnal",
    pincode: "132001",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "demo-2",
    name: "Byadgi Chilli",
    description: "Famous red chilli known for deep color and mild spice.",
    type: "Spice",
    village: "Byadgi",
    pincode: "581106",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
];

export default function Specialties() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState<Specialty[]>(MOCK_SPECIALTIES);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH FROM BACKEND ---------------- */

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(`${API_URL}/api/specialties`);
        if (!res.ok) throw new Error("Failed to fetch specialties");

        const data = await res.json();

        if (Array.isArray(data)) {
          setSpecialties((prev) => [
            ...data.map((item: any) => ({
              id: item.id,
              name: item.title, // 👈 map title → name
              type: item.category, // 👈 map category → type
              description: item.description,
              village: item.village,
              pincode: item.pincode,
              createdAt: item.createdAt,
              isDemo: false,
            })),
            ...prev,
          ]);
        }
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
            <h1 className="font-serif text-4xl font-bold">Pride of the Land</h1>
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
            <p className="text-muted-foreground">No specialties added yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((item, index) => (
              <article
                key={item.id}
                className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Demo Badge */}
                {item.isDemo && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Demo
                  </div>
                )}

                {/* Category Badge */}
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    typeColors[item.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.type}
                </span>

                {/* Title */}
                <h2 className="font-serif text-2xl font-semibold mb-3">
                  {item.name}
                </h2>

                {/* Description */}
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Divider + Location */}
                <div className="border-t border-border pt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {item.village}
                  </span>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
