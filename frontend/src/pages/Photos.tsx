import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-village.jpg";

/* ---------------- TYPES ---------------- */

type Village = {
  id: string;
  name: string;
};

type Photo = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  village: string;
  pincode: string;
};

/* ---------------- DEFAULT ---------------- */

const DEFAULT_PHOTOS: Photo[] = [
  {
    id: "demo",
    title: "Rice Fields at Dawn",
    imageUrl: heroImage,
    village: "Wayanad",
    pincode: "673121"
  }
];

const API_URL = import.meta.env.VITE_API_URL;

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PHOTOS);
  const [showForm, setShowForm] = useState(false);

  /* FORM STATE */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [village, setVillage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingVillage, setLoadingVillage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- PINCODE → VILLAGES ---------------- */
  useEffect(() => {
    if (pincode.length !== 6) {
      setVillages([]);
      setVillage("");
      return;
    }

    const t = setTimeout(async () => {
      setLoadingVillage(true);
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

    return () => clearTimeout(t);
  }, [pincode]);

  /* ---------------- LOAD PHOTOS ---------------- */
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/photos`);
      if (!res.ok) return;

      const data = await res.json();
      setPhotos(data);
    })();
  }, []);

  /* ---------------- UPLOAD ---------------- */
  async function uploadPhoto() {
    if (!file || !title || !pincode || !village) return;

    setSubmitting(true);

    const fd = new FormData();
    fd.append("photo", file);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("pincode", pincode);
    fd.append("villageName", village);

    const res = await fetch(`${API_URL}/api/photos`, {
      method: "POST",
      body: fd
    });

    if (!res.ok) {
      alert("Upload failed");
      setSubmitting(false);
      return;
    }

    const newPhoto = await res.json();
    setPhotos(prev => [newPhoto, ...prev]);

    setShowForm(false);
    setTitle("");
    setDescription("");
    setPincode("");
    setVillage("");
    setVillages([]);
    setFile(null);
    setSubmitting(false);
  }

  return (
    <Layout>
      <section className="py-12 border-b">
        <div className="village-container flex justify-between">
          <h1 className="font-serif text-3xl">Village Photos</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Upload
          </Button>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12">
        <div className="village-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="rounded-xl overflow-hidden border">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="font-serif text-lg">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-muted-foreground">
                    {photo.description}
                  </p>
                )}
                <p className="text-sm flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  {photo.village} ({photo.pincode})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative space-y-3">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <input
              className="border p-3 rounded w-full"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              className="border p-3 rounded w-full"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <input
              className="border p-3 rounded w-full"
              placeholder="Pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
            />

            {loadingVillage && <p className="text-sm">Detecting villages…</p>}

            {villages.length > 1 && (
              <select
                className="border p-3 rounded w-full"
                value={village}
                onChange={e => setVillage(e.target.value)}
              >
                <option value="">Select village</option>
                {villages.map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            )}

            {villages.length === 1 && (
              <input
                className="border p-3 rounded w-full bg-gray-100"
                value={village}
                readOnly
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <Button
              className="w-full"
              onClick={uploadPhoto}
              disabled={submitting || !village}
            >
              {submitting ? "Uploading…" : "Upload Photo"}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
