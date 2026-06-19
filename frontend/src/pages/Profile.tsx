import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { authFetch, BASE_URL as API_URL, getUserEmail, getUserId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BookOpen, Camera, UtensilsCrossed, Leaf, MapPin, X } from "lucide-react";

type UserStory = {
  id: string;
  title: string;
  originalText: string;
  originalLang: string;
  createdAt: string;
  author: { email: string };
  village: {
    id: string;
    name: string;
    pincode: string;
  };
};

type UserPhoto = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  village: string;
  pincode: string;
  uploadedBy?: string;
};

type UserFood = {
  id: string;
  name: string;
  description?: string;
  ingredients?: string;
  imageUrl?: string;
  village: string;
  pincode: string;
  createdBy?: string;
};

type UserSpecialty = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  village: string;
  pincode: string;
  createdBy?: string;
};

const isOwnedByMe = (owner: string | undefined, userId: string | null, userEmail: string | null) => {
  return owner === userId || owner === userEmail;
};

export default function Profile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [userAvatar, setUserAvatar] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('userAvatar') : null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [foods, setFoods] = useState<UserFood[]>([]);
  const [specialties, setSpecialties] = useState<UserSpecialty[]>([]);

  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<(UserPhoto & { _file?: File }) | null>(null);
  const [editingFood, setEditingFood] = useState<UserFood | null>(null);
  const [editingSpecialty, setEditingSpecialty] = useState<UserSpecialty | null>(null);

  const [savingStory, setSavingStory] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingFood, setSavingFood] = useState(false);
  const [savingSpecialty, setSavingSpecialty] = useState(false);

  useEffect(() => {
    setUserEmail(getUserEmail());
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!API_URL) return;

    const loadProfile = async () => {
      if (!userEmail || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [storiesRes, photosRes, foodsRes, specialtiesRes] = await Promise.all([
          authFetch(`${API_URL}/api/stories`),
          authFetch(`${API_URL}/api/photos`),
          authFetch(`${API_URL}/api/foods`),
          authFetch(`${API_URL}/api/specialties`),
        ]);

        if (!storiesRes.ok || !photosRes.ok || !foodsRes.ok || !specialtiesRes.ok) {
          throw new Error("Failed to load profile content.");
        }

        const [storiesData, photosData, foodsData, specialtiesData] = await Promise.all([
          storiesRes.json(),
          photosRes.json(),
          foodsRes.json(),
          specialtiesRes.json(),
        ]);

        setStories((storiesData as UserStory[]).filter((item) => item.author?.email === userEmail));
        setPhotos((photosData as UserPhoto[]).filter((item) => isOwnedByMe(item.uploadedBy, userId, userEmail)));
        setFoods((foodsData as UserFood[]).filter((item) => isOwnedByMe(item.createdBy, userId, userEmail)));
        setSpecialties((specialtiesData as UserSpecialty[]).filter((item) => isOwnedByMe(item.createdBy, userId, userEmail)));
      } catch (err) {
        setError("Unable to load your profile content.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userEmail, userId]);

  const deleteStory = async (storyId: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      const res = await authFetch(`${API_URL}/api/stories/${storyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setStories((prev) => prev.filter((item) => item.id !== storyId));
    } catch {
      alert("Failed to delete story.");
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await authFetch(`${API_URL}/api/photos/${photoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPhotos((prev) => prev.filter((item) => item.id !== photoId));
    } catch {
      alert("Failed to delete photo.");
    }
  };

  const deleteFood = async (foodId: string) => {
    if (!confirm("Delete this food?")) return;
    try {
      const res = await authFetch(`${API_URL}/api/foods/${foodId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFoods((prev) => prev.filter((item) => item.id !== foodId));
    } catch {
      alert("Failed to delete food.");
    }
  };

  const deleteSpecialty = async (specialtyId: string) => {
    if (!confirm("Delete this specialty?")) return;
    try {
      const res = await authFetch(`${API_URL}/api/specialties/${specialtyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSpecialties((prev) => prev.filter((item) => item.id !== specialtyId));
    } catch {
      alert("Failed to delete specialty.");
    }
  };

  const saveStory = async () => {
    if (!editingStory) return;
    setSavingStory(true);
    try {
      const res = await authFetch(`${API_URL}/api/stories/${editingStory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingStory.title,
          originalText: editingStory.originalText,
          originalLang: editingStory.originalLang || "en",
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStories((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingStory(null);
    } catch {
      alert("Failed to update story.");
    } finally {
      setSavingStory(false);
    }
  };

  const savePhoto = async () => {
    if (!editingPhoto) return;
    setSavingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("title", editingPhoto.title);
      if (editingPhoto.description) fd.append("description", editingPhoto.description);
      fd.append("pincode", editingPhoto.pincode);
      if (editingPhoto._file) fd.append("photo", editingPhoto._file);

      const res = await authFetch(`${API_URL}/api/photos/${editingPhoto.id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPhotos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingPhoto(null);
    } catch {
      alert("Failed to update photo.");
    } finally {
      setSavingPhoto(false);
    }
  };

  const saveFood = async () => {
    if (!editingFood) return;
    setSavingFood(true);
    try {
      const fd = new FormData();
      fd.append("name", editingFood.name);
      if (editingFood.description) fd.append("description", editingFood.description);
      if (editingFood.ingredients) fd.append("ingredients", editingFood.ingredients);

      const res = await authFetch(`${API_URL}/api/foods/${editingFood.id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setFoods((prev) => prev.map((item) => (item.id === updated.id ? { ...updated, isDemo: false } : item)));
      setEditingFood(null);
    } catch {
      alert("Failed to update food.");
    } finally {
      setSavingFood(false);
    }
  };

  const saveSpecialty = async () => {
    if (!editingSpecialty) return;
    setSavingSpecialty(true);
    try {
      const payload = {
        title: editingSpecialty.title,
        description: editingSpecialty.description,
        category: editingSpecialty.category,
      };
      const res = await authFetch(`${API_URL}/api/specialties/${editingSpecialty.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setSpecialties((prev) => prev.map((item) => (item.id === updated.id ? { ...item, title: updated.title, description: updated.description, category: updated.category } : item)));
      setEditingSpecialty(null);
    } catch {
      alert("Failed to update specialty.");
    } finally {
      setSavingSpecialty(false);
    }
  };

  if (!userEmail || !userId) {
    return (
      <Layout>
        <div className="village-container py-32 text-center">
          <h1 className="font-serif text-3xl mb-4">Your Profile</h1>
          <p className="text-muted-foreground mb-6">
            Log in to see the content you added and manage it from one place.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/login">
              <Button>Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="village-container py-6 md:py-12">
        <div className="grid gap-6 md:gap-10">
          <div className="rounded-2xl md:rounded-3xl border border-border bg-white p-4 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userEmail || 'avatar'} className="h-16 md:h-20 w-16 md:w-20 rounded-full object-cover border" />
                  ) : (
                    <div className="h-16 md:h-20 w-16 md:w-20 rounded-full bg-muted flex items-center justify-center text-lg md:text-xl font-semibold">{(userEmail || 'U').split('@')[0].slice(0,2).toUpperCase()}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Logged in as</p>
                  <h1 className="font-serif text-xl md:text-3xl truncate">{userEmail}</h1>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 md:px-4 py-2 text-xs md:text-sm text-slate-700 w-fit">
                  <MapPin className="w-3 md:w-4 h-3 md:h-4" />
                  {stories.length + photos.length + foods.length + specialties.length} items
                </span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="text-xs px-2 py-1 flex-1 sm:flex-none" />
                  <Button onClick={async () => {
                    if (!avatarFile) return alert('Select a file');
                    setUploadingAvatar(true);
                    try {
                      const fd = new FormData();
                      fd.append('avatar', avatarFile);
                      const res = await authFetch(`${API_URL}/api/auth/avatar`, { method: 'PUT', body: fd });
                      if (!res.ok) throw new Error();
                      const data = await res.json();
                      localStorage.setItem('userAvatar', data.avatarUrl);
                      setUserAvatar(data.avatarUrl);
                      setAvatarFile(null);
                    } catch (err) {
                      alert('Failed to upload avatar');
                    } finally { setUploadingAvatar(false); }
                  }} disabled={uploadingAvatar} className="text-xs md:text-sm px-3 md:px-4 py-2">{uploadingAvatar ? 'Uploading...' : 'Upload'}</Button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl md:rounded-3xl border border-destructive/30 bg-destructive/5 p-4 md:p-6 text-destructive text-sm md:text-base">
              {error}
            </div>
          )}

          {(loading || (!error && stories.length + photos.length + foods.length + specialties.length === 0)) && (
            <div className="rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
              {loading ? (
                <p>Loading your profile content…</p>
              ) : (
                <>
                  <p className="text-lg font-medium">No items found yet.</p>
                  <p className="text-muted-foreground mt-2">Add stories, photos, foods, or specialties to see them here.</p>
                </>
              )}
            </div>
          )}

          <div className="grid gap-10">
            <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Stories</p>
                  <h2 className="text-2xl font-semibold">Shared stories</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{stories.length}</span>
              </div>
              {stories.length === 0 ? (
                <p className="text-muted-foreground mt-6">You haven't shared any stories yet.</p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {stories.map((story) => (
                    <div key={story.id} className="border border-border rounded-3xl p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{story.title}</h3>
                          <p className="text-sm text-muted-foreground">{story.village.name} • {story.village.pincode}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingStory(story)}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteStory(story.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{story.originalText.slice(0, 180)}{story.originalText.length > 180 ? "…" : ""}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Photos</p>
                  <h2 className="text-2xl font-semibold">Uploaded photos</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{photos.length}</span>
              </div>
              {photos.length === 0 ? (
                <p className="text-muted-foreground mt-6">You haven't uploaded any photos yet.</p>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="overflow-hidden rounded-3xl border border-border bg-slate-50 shadow-sm">
                      <img src={photo.imageUrl} alt={photo.title} className="h-48 w-full object-cover" />
                      <div className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{photo.title}</h3>
                            <p className="text-sm text-muted-foreground">{photo.village} • {photo.pincode}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingPhoto(photo)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePhoto(photo.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        {photo.description && <p className="mt-3 text-sm text-muted-foreground">{photo.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Foods</p>
                  <h2 className="text-2xl font-semibold">Added dishes</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{foods.length}</span>
              </div>
              {foods.length === 0 ? (
                <p className="text-muted-foreground mt-6">You haven't added any foods yet.</p>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {foods.map((food) => (
                    <div key={food.id} className="border border-border rounded-3xl p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{food.name}</h3>
                          <p className="text-sm text-muted-foreground">{food.village} • {food.pincode}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingFood(food)}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteFood(food.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                      {food.description && <p className="mt-4 text-sm text-muted-foreground">{food.description}</p>}
                      {food.ingredients && <p className="mt-2 text-sm text-muted-foreground"><strong>Ingredients:</strong> {food.ingredients}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Specialties</p>
                  <h2 className="text-2xl font-semibold">Village specialties</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{specialties.length}</span>
              </div>
              {specialties.length === 0 ? (
                <p className="text-muted-foreground mt-6">You haven't added any specialties yet.</p>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {specialties.map((item) => (
                    <div key={item.id} className="border border-border rounded-3xl p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.village} • {item.pincode}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingSpecialty(item)}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteSpecialty(item.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      {editingStory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative">
            <button onClick={() => setEditingStory(null)} className="absolute right-6 top-6">
              <X />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Story</h2>
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingStory.title}
              onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
            />
            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              rows={6}
              value={editingStory.originalText}
              onChange={(e) => setEditingStory({ ...editingStory, originalText: e.target.value })}
            />
            <div className="flex gap-3">
              <Button onClick={saveStory} disabled={savingStory}>
                {savingStory ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingStory(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingPhoto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative">
            <button onClick={() => setEditingPhoto(null)} className="absolute right-6 top-6">
              <X />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Photo</h2>
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingPhoto.title}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
            />
            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              rows={4}
              value={editingPhoto.description ?? ""}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
            />
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingPhoto.pincode}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, pincode: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditingPhoto(editingPhoto ? { ...editingPhoto, _file: e.target.files?.[0] || undefined } : null)}
              className="w-full"
            />
            <div className="flex gap-3">
              <Button onClick={savePhoto} disabled={savingPhoto}>
                {savingPhoto ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingPhoto(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingFood && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative">
            <button onClick={() => setEditingFood(null)} className="absolute right-6 top-6">
              <X />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Food</h2>
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingFood.name}
              onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
            />
            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              rows={4}
              value={editingFood.description ?? ""}
              onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })}
            />
            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              rows={2}
              value={editingFood.ingredients ?? ""}
              onChange={(e) => setEditingFood({ ...editingFood, ingredients: e.target.value })}
            />
            <div className="flex gap-3">
              <Button onClick={saveFood} disabled={savingFood}>
                {savingFood ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingFood(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingSpecialty && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative">
            <button onClick={() => setEditingSpecialty(null)} className="absolute right-6 top-6">
              <X />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Specialty</h2>
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingSpecialty.title}
              onChange={(e) => setEditingSpecialty({ ...editingSpecialty, title: e.target.value })}
            />
            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              rows={4}
              value={editingSpecialty.description}
              onChange={(e) => setEditingSpecialty({ ...editingSpecialty, description: e.target.value })}
            />
            <input
              className="w-full border p-3 rounded-lg mb-4"
              value={editingSpecialty.category}
              onChange={(e) => setEditingSpecialty({ ...editingSpecialty, category: e.target.value })}
            />
            <div className="flex gap-3">
              <Button onClick={saveSpecialty} disabled={savingSpecialty}>
                {savingSpecialty ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setEditingSpecialty(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
