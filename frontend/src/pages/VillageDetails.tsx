/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface Village {
  id: string;
  name: string;
  pincode: string;
}

interface VillageData {
  village: Village;
  specialties: any[];
  food: any[];
  stories: any[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function VillageDetails() {
  const { villageId } = useParams<{ villageId: string }>();

  const [data, setData] = useState<VillageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!villageId) return;

    const fetchVillageDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/api/village-details/${villageId}`
        );

        if (!res.ok) {
          throw new Error("Village not found");
        }

        const json: VillageData = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("VillageDetails error:", err);
        setError(err.message || "Failed to load village");
      } finally {
        setLoading(false);
      }
    };

    fetchVillageDetails();
  }, [villageId]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <Layout>
        <div className="p-10 text-muted-foreground">
          Loading village data…
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-10 text-destructive">
          {error}
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="p-10 text-muted-foreground">
          No data available.
        </div>
      </Layout>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <section className="py-12">
        <div className="village-container space-y-12">

          {/* HEADER */}
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">
              {data.village.name}
            </h1>

            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {data.village.pincode}
            </p>
          </div>

          {/* SPECIALTIES */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Specialties</h2>

            {data.specialties?.length === 0 ? (
              <p className="text-muted-foreground">
                No specialties added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.specialties.map((s) => (
                  <li key={s.id} className="bg-white p-4 rounded-xl shadow">
                    <p className="font-medium">
                      {s.title || s.name}
                    </p>
                    {s.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {s.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* FOOD */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Local Food</h2>

            {data.food?.length === 0 ? (
              <p className="text-muted-foreground">
                No food items added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.food.map((f) => (
                  <li key={f.id} className="bg-white p-4 rounded-xl shadow">
                    <p className="font-medium">{f.name}</p>
                    {f.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {f.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* STORIES */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Stories</h2>

            {data.stories?.length === 0 ? (
              <p className="text-muted-foreground">
                No stories shared yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.stories.map((s) => (
                  <li key={s.id} className="bg-white p-4 rounded-xl shadow">
                    <p className="font-medium">{s.title}</p>
                    {s.originalText && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {s.originalText.slice(0, 140)}…
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </section>
    </Layout>
  );
}
