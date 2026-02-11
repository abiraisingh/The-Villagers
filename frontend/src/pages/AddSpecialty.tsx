/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Village {
  id: string;
  name: string;
}

interface SpecialtyForm {
  title: string;
  description: string;
  category: string;
  pincode: string;
  village: string;
}

export default function AddSpecialty() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SpecialtyForm>({
    title: "",
    description: "",
    category: "",
    pincode: "",
    village: "",
  });

  const [villages, setVillages] = useState<Village[]>([]);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- PINCODE → VILLAGES ---------------- */
  useEffect(() => {
    if (form.pincode.length !== 6) {
      setVillages([]);
      setForm((p) => ({ ...p, village: "" }));
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingVillages(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/api/pincodes/${form.pincode}`
        );

        if (!res.ok) throw new Error("Invalid pincode");

        const data = await res.json();
        const list: Village[] = data.villages || [];

        setVillages(list);

        if (list.length === 1) {
          setForm((p) => ({ ...p, village: list[0].name }));
        } else {
          setForm((p) => ({ ...p, village: "" }));
        }
      } catch {
        setVillages([]);
        setForm((p) => ({ ...p, village: "" }));
        setError("No villages found for this pincode.");
      } finally {
        setLoadingVillages(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.pincode]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.title.trim()) return setError("Title is required.");
    if (form.pincode.length !== 6)
      return setError("Valid pincode required.");
    if (!form.village) return setError("Village is required.");
    if (!form.category.trim())
      return setError("Category is required.");

    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        pincode: form.pincode,
        villageName: form.village,
      };

      const res = await fetch(`${API_URL}/api/specialties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add specialty");
      }

      setSuccess("Specialty added successfully!");
      setTimeout(() => navigate("/specialties"), 1200);
    } catch (err: any) {
      setError(err.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Layout>
      <section className="py-12">
        <div className="village-container max-w-2xl">
          <h1 className="font-serif text-3xl font-bold mb-6">
            Add Specialty
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/10 text-green-700 rounded-lg flex gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              placeholder="Specialty Title"
              value={form.title}
              onChange={handleChange}
              className="w-full input"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full input"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full input"
            />

            {villages.length > 1 ? (
              <select
                name="village"
                value={form.village}
                onChange={handleChange}
                className="w-full input"
              >
                <option value="">Select village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="village"
                placeholder="Village"
                value={form.village}
                readOnly={villages.length === 1}
                onChange={handleChange}
                className="w-full input"
              />
            )}

            <input
              name="category"
              placeholder="Category (Food, Craft, Festival...)"
              value={form.category}
              onChange={handleChange}
              className="w-full input"
            />

            <Button type="submit" disabled={loading || loadingVillages}>
              {loading ? "Submitting..." : "Add Specialty"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
