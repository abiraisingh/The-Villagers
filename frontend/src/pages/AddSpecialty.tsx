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
  /* ---------------- UI ---------------- */
return (
  <Layout>
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="village-container max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold mb-3">
            Add Village Specialty
          </h1>
          <p className="text-muted-foreground">
            Share what makes your village unique — crops, crafts, festivals, or traditions.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Specialty Title
              </label>
              <input
                name="title"
                placeholder="e.g. Alphonso Mango"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Tell us why it's special..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
            </div>

            {/* Pincode + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pincode
                </label>
                <input
                  name="pincode"
                  placeholder="Enter 6-digit pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  name="category"
                  placeholder="Food, Craft, Festival..."
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            {/* Village */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Village
              </label>

              {villages.length > 1 ? (
                <select
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  className="w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"
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
                  placeholder="Village name"
                  value={form.village}
                  readOnly={villages.length === 1}
                  onChange={handleChange}
                  className={`w-full border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition ${
                    villages.length === 1 ? "bg-muted/30 cursor-not-allowed" : ""
                  }`}
                />
              )}

              {loadingVillages && (
                <p className="text-xs text-muted-foreground mt-2">
                  Detecting villages…
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl"
                disabled={loading || loadingVillages}
              >
                {loading ? "Submitting..." : "Add Specialty"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </section>
  </Layout>
);
}
