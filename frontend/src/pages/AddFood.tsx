import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;
/* ---------------- TYPES ---------------- */

type Village = {
  id: string;
  name: string;
};

/* ---------------- COMPONENT ---------------- */

export default function AddFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [village, setVillage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loadingVillage, setLoadingVillage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------------- PINCODE → VILLAGES ---------------- */

  useEffect(() => {
    if (pincode.length !== 6) {
      setVillages([]);
      setVillage("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingVillage(true);
      setVillages([]);
      setVillage("");

      try {
        const res = await fetch(
          `${API_URL}/api/pincodes/${pincode}`
        );

        if (!res.ok) return;

        const data = await res.json();

        if (Array.isArray(data.villages)) {
          setVillages(data.villages);

          if (data.villages.length === 1) {
            setVillage(data.villages[0].name);
          }
        }
      } finally {
        setLoadingVillage(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pincode]);

  /* ---------------- SUBMIT ---------------- */

  async function submitFood() {
    if (!name || !pincode || !village) {
      alert("Dish name, pincode and village are required");
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("pincode", pincode);
    formData.append("villageName", village); // ✅ MUST MATCH BACKEND

    if (file) {
      formData.append("image", file); // ✅ FILE, NOT BASE64
    }

    try {
      const res = await fetch(`${API_URL}/api/foods`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      setSuccess(true);

      // reset
      setName("");
      setDescription("");
      setIngredients("");
      setPincode("");
      setVillage("");
      setVillages([]);
      setFile(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="bg-[#faf7f2] min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* HEADER */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm mb-3">
              <UtensilsCrossed className="w-4 h-4" />
              Add Village Food
            </div>
            <h1 className="font-serif text-3xl font-bold">
              Share a Traditional Dish
            </h1>
            <p className="text-muted-foreground mt-2">
              Preserve your village’s food culture and recipes.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Dish name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border p-3 rounded-xl w-full"
              rows={3}
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              className="border p-3 rounded-xl w-full"
              rows={3}
              placeholder="Ingredients (comma separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />

            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />

            {loadingVillage && (
              <p className="text-sm text-muted-foreground">
                Detecting villages…
              </p>
            )}

            {villages.length > 1 && (
              <select
                className="border p-3 rounded-xl w-full"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              >
                <option value="">Select village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}

            {villages.length === 1 && (
              <input
                className="border p-3 rounded-xl w-full bg-gray-100"
                readOnly
                value={village}
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

            <Button
              className="w-full"
              disabled={submitting || !village}
              onClick={submitFood}
            >
              {submitting ? "Publishing..." : "Publish Dish"}
            </Button>

            {success && (
              <p className="text-green-600 text-center text-sm">
                Food added successfully 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
