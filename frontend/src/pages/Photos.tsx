import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { authFetch, BASE_URL as API_URL } from "@/lib/api";
import { Plus, X, MapPin, Heart, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-village.jpg";
import redfort from "@/assets/red-fort.avif";
import hawamahal from "@/assets/Hawamahal.jpg";
import rudraprayag from "@/assets/rudrprayag.avif";
import katra from "@/assets/katra.jpg";
import amritsar from "@/assets/amritsar.avif";

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
  uploadedBy?: string;
};

type PhotoResponse = Photo & {
  likesCount?: number;
};

/* ---------------- DEFAULT ---------------- */

const DEFAULT_PHOTOS: Photo[] = [
  {
    id: "demo1",
    title: "Hawa Mahal",
    imageUrl: hawamahal,
    village: "Jaipur",
    pincode: "302002"
  },
  {
    id: "demo2",
    title: "Red Fort",
    imageUrl: redfort,
    village: "Delhi",
    pincode: "110006"
  },
  {
    id: "demo3",
    title: "Rudraprayag",
    imageUrl: rudraprayag,
    village: "Rudraprayag",
    pincode: "246171"
  },
  {
    id: "demo4",
    title: "Vaishno Devi Temple",
    imageUrl: katra,
    village: "Katra",
    pincode: "182301"
  },
  {
    id: "demo5",
    title: "Golden Temple",
    imageUrl: amritsar,
    village: "Amritsar",
    pincode: "143006"
  },
  {
    id: "demo6",
    title: "Rice Fields at Dawn",
    imageUrl: heroImage,
    village: "Wayanad",
    pincode: "673121"
  }
];



export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PHOTOS);
  const [liked, setLiked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('likedPhotos');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [likesCount, setLikesCount] = useState<Record<string, number>>(() => ({}));
  const [animating, setAnimating] = useState<Record<string, boolean>>(() => ({}));
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<(Photo & { _file?: File }) | null>(null);
  const [editPhotoSubmitting, setEditPhotoSubmitting] = useState(false);

  /* FORM STATE */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [village, setVillage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingVillage, setLoadingVillage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- AUTH STATE ---------------- */

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

      const data = await res.json() as PhotoResponse[];
      setPhotos(data);
      // init likes
      const counts: Record<string, number> = {};
      data.forEach((p) => counts[p.id] = p.likesCount ?? 0);
      setLikesCount(counts);
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

    const res = await authFetch(`${API_URL}/api/photos`, {
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
        <div className="village-container flex justify-between items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl">Village Photos</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Upload
          </Button>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12">
        <div className="village-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="rounded-xl overflow-hidden border bg-white">
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

                <div className="mt-3 flex items-center gap-2 justify-end">
                  <Button variant={liked[photo.id] ? 'destructive' : 'outline'} size="sm" onClick={async () => {
                    const token = localStorage.getItem('token');
                    if (!token) { alert('Log in to like photos'); return; }

                    setAnimating(prev => ({ ...prev, [photo.id]: true }));
                    setTimeout(() => setAnimating(prev => ({ ...prev, [photo.id]: false })), 450);

                    try {
                      const res = await authFetch(`${API_URL}/api/photos/${photo.id}/like`, { method: 'POST' });
                      if (!res.ok) throw new Error();
                      const data = await res.json();
                      setLikesCount(prev => ({ ...prev, [photo.id]: data.likesCount }));
                      setLiked(prev => ({ ...prev, [photo.id]: data.liked }));
                    } catch { alert('Failed to like'); }
                  }}>
                    <Heart className={"w-4 h-4 " + (animating[photo.id] ? 'animate-pulse' : '')} /> {likesCount[photo.id] ? `${likesCount[photo.id]} • ` : ''}{liked[photo.id] ? 'Liked' : 'Like'}
                  </Button>

                  <Button variant="ghost" size="sm" onClick={async () => {
                    const text = `${photo.title} — ${photo.description ?? ''}\n\nView on The Villagers.`;
                    try {
                      if (navigator.share) await navigator.share({ title: photo.title, text });
                      else { await navigator.clipboard.writeText(text); toast({ title: 'Copied', description: 'Photo copied to clipboard' }); }
                    } catch { alert('Unable to share'); }
                  }}>
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </div>
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

      {/* EDIT PHOTO MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative space-y-3">
            <button
              onClick={() => setEditingPhoto(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <input
              className="border p-3 rounded w-full"
              placeholder="Title"
              value={editingPhoto.title}
              onChange={e => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
            />

            <textarea
              className="border p-3 rounded w-full"
              placeholder="Description"
              value={editingPhoto.description}
              onChange={e => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full"
              placeholder="Pincode"
              value={editingPhoto?.pincode ?? ""}
              onChange={e => setEditingPhoto(editingPhoto ? { ...editingPhoto, pincode: e.target.value } : null)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={e => setEditingPhoto({ ...editingPhoto, _file: e.target.files?.[0] || null })}
            />

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={async () => {
                  if (!editingPhoto) return;
                  setEditPhotoSubmitting(true);
                  try {
                    const fd = new FormData();
                    fd.append('title', editingPhoto.title);
                    if (editingPhoto.description) fd.append('description', editingPhoto.description);
                    if (editingPhoto.pincode) fd.append('pincode', editingPhoto.pincode);
                    if (editingPhoto._file) fd.append('photo', editingPhoto._file);
                    const res = await authFetch(`${API_URL}/api/photos/${editingPhoto.id}`, {
                      method: 'PUT',
                      body: fd
                    });
                    if (!res.ok) throw new Error();
                    const updated = await res.json();
                    setPhotos(prev => prev.map(p => (p.id === updated.id ? updated : p)));
                    setEditingPhoto(null);
                  } catch {
                    alert('Failed to update photo');
                  } finally {
                    setEditPhotoSubmitting(false);
                  }
                }}
                disabled={editPhotoSubmitting}
              >
                {editPhotoSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button variant="ghost" onClick={() => setEditingPhoto(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
