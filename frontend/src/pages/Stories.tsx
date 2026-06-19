import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { authFetch, BASE_URL as API_URL } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

type Village = {
  id: string;
  name: string;
};

type Story = {
  id: string;
  title: string;
  originalText: string;
  createdAt: string;
  author: { email: string };
  village: {
    id: string;
    name: string;
    pincode: string;
  };
};

type StoryResponse = Story & {
  likesCount?: number;
};



/* ---------------- MOCK STORIES ---------------- */

const mockStories: Story[] = [
  {
    id: "mock1",
    title: "The Festival of Lights",
    originalText:
      "Every year our village gathers to celebrate the festival of lights. Houses glow, elders share stories, and children dance around the temple courtyard.",
    createdAt: new Date().toISOString(),
    author: { email: "elder@village.com" },
    village: { id: "v1", name: "Sundarpur", pincode: "123456" },
  },
  {
    id: "mock2",
    title: "The Festival of Lights",
    originalText:
      "Every year our village gathers to celebrate the festival of lights. Houses glow, elders share stories, and children dance around the temple courtyard.",
    createdAt: new Date().toISOString(),
    author: { email: "elder@village.com" },
    village: { id: "v1", name: "Sundarpur", pincode: "123456" },
  },
  {
    id: "mock3",
    title: "The Festival of Lights",
    originalText:
      "Every year our village gathers to celebrate the festival of lights. Houses glow, elders share stories, and children dance around the temple courtyard.",
    createdAt: new Date().toISOString(),
    author: { email: "elder@village.com" },
    village: { id: "v1", name: "Sundarpur", pincode: "123456" },
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Stories() {
  const [allStories, setAllStories] = useState<Story[]>(mockStories);
  const [visibleStories, setVisibleStories] = useState<Story[]>(mockStories);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  /* ---------------- FILTER STATES ---------------- */

  const [pincode, setPincode] = useState("");
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editStorySubmitting, setEditStorySubmitting] = useState(false);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [villageError, setVillageError] = useState("");

  /* ---------------- ADD STORY STATES ---------------- */

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [formPincode, setFormPincode] = useState("");
  const [formVillages, setFormVillages] = useState<Village[]>([]);
  const [formVillage, setFormVillage] = useState<Village | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('likedStories');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [likesCount, setLikesCount] = useState<Record<string, number>>(() => ({}));
  const [animating, setAnimating] = useState<Record<string, boolean>>(() => ({}));

  /* ---------------- LOAD STORIES ---------------- */

  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/api/stories`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: StoryResponse[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllStories((prev) => [...data, ...prev]);
          setVisibleStories((prev) => [...data, ...prev]);

          // initialize likes count
          const counts: Record<string, number> = {};
          data.forEach((s) => counts[s.id] = s.likesCount ?? 0);
          setLikesCount((prev) => ({ ...counts, ...prev }));
        }
      })
      .catch(() => {});
  }, []);

  /* ---------------- FIND VILLAGES ---------------- */

  async function findVillages() {
    if (pincode.length !== 6 || !API_URL) return;

    setLoadingVillages(true);
    setVillages([]);
    setSelectedVillage(null);
    setVillageError("");

    try {
      const res = await fetch(`${API_URL}/api/pincodes/${pincode}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const list: Village[] = data.villages || [];

      if (list.length === 0) {
        setVillageError("No villages found for this pincode.");
        setVisibleStories([]);
        return;
      }

      setVillages(list);

      if (list.length === 1) {
        applyVillageFilter(list[0]);
      }
    } catch {
      setVillageError("Something went wrong. Please try again.");
    } finally {
      setLoadingVillages(false);
    }
  }

  function applyVillageFilter(village: Village) {
    setSelectedVillage(village);
    setVisibleStories(
      allStories.filter((s) => s.village.id === village.id)
    );
  }

  function clearFilter() {
    setPincode("");
    setVillages([]);
    setSelectedVillage(null);
    setVillageError("");
    setVisibleStories(allStories);
  }

  /* ---------------- FORM PINCODE FETCH ---------------- */

  useEffect(() => {
    if (formPincode.length !== 6 || !API_URL) {
      setFormVillages([]);
      setFormVillage(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`${API_URL}/api/pincodes/${formPincode}`);
      if (!res.ok) return;

      const data = await res.json();
      const list: Village[] = data.villages || [];

      setFormVillages(list);

      if (list.length === 1) {
        setFormVillage(list[0]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formPincode]);

  /* ---------------- SUBMIT STORY ---------------- */

  async function submitStory() {
    if (!email || !title || !text || !formVillage || !API_URL) return;

    setSubmitting(true);

    try {
      const res = await authFetch(`${API_URL}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          originalText: text,
          originalLang: "en",
          villageId: formVillage.id,
        }),
      });

      if (!res.ok) throw new Error();

      const newStory: Story = await res.json();

      setAllStories((prev) => {
        const updated = [newStory, ...prev];

        if (selectedVillage) {
          setVisibleStories(
            updated.filter(
              (s) => s.village.id === selectedVillage.id
            )
          );
        } else {
          setVisibleStories(updated);
        }

        return updated;
      });

      setShowForm(false);
      setEmail("");
      setTitle("");
      setText("");
      setFormPincode("");
      setFormVillage(null);
      setFormVillages([]);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-sunset texture-grain">
        <div className="max-w-7xl mx-auto px-8 py-14 space-y-10">

          {/* HEADER */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl">Village Stories</h1>
            </div>
            <Button
              variant="hero"
              size="sm"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Close" : "Add Story"}
            </Button>
          </div>

          {/* ADD STORY FORM */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl space-y-6"
            >
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Add your village story
              </h2>

              <input
                placeholder="Your Email"
                className="w-full border p-3 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Story Title"
                className="w-full border p-3 rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Write your story..."
                rows={5}
                className="w-full border p-3 rounded-xl"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <input
                placeholder="Village Pincode"
                className="w-full border p-3 rounded-xl"
                value={formPincode}
                onChange={(e) =>
                  setFormPincode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
              />

              {formVillages.length > 1 && (
                <select
                  className="w-full border p-3 rounded-xl"
                  value={formVillage?.id || ""}
                  onChange={(e) =>
                    setFormVillage(
                      formVillages.find(
                        (v) => v.id === e.target.value
                      ) || null
                    )
                  }
                >
                  <option value="">Select Village</option>
                  {formVillages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}

              {formVillages.length === 1 && formVillage && (
                <input
                  className="w-full border p-3 rounded-xl bg-gray-100"
                  value={formVillage.name}
                  readOnly
                />
              )}

              <Button
                className="w-full py-3 rounded-xl"
                variant={submitting || !formVillage ? "secondary" : "default"}
                size="default"
                onClick={submitStory}
                disabled={submitting || !formVillage}
              >
                {submitting ? "Publishing..." : "Publish Story"}
              </Button>
            </motion.div>
          )}

          {/* FILTER SECTION */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <input
                className="border px-4 py-2 rounded-xl"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) => e.key === "Enter" && findVillages()}
              />

              <Button
                variant="default"
                size="sm"
                onClick={findVillages}
                disabled={pincode.length !== 6 || loadingVillages}
              >
                {loadingVillages ? "Searching..." : "Find Village"}
              </Button>

              {selectedVillage && (
                <Button variant="ghost" size="sm" onClick={clearFilter}>
                  Clear
                </Button>
              )}
            </div>

            {villageError && (
              <p className="text-red-500 text-sm">
                {villageError}
              </p>
            )}

            {villages.length > 1 && !selectedVillage && (
              <select
                className="border px-4 py-2 rounded-xl"
                defaultValue=""
                onChange={(e) => {
                  const village =
                    villages.find((v) => v.id === e.target.value) ||
                    null;
                  if (village) applyVillageFilter(village);
                }}
              >
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* STORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {visibleStories.map((story) => (
              <motion.div
                key={story.id}
                className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between"
              >
                <div onClick={() => setActiveStory(story)} className="cursor-pointer">
                  <h3 className="text-xl font-serif">{story.title}</h3>
                  <p className="text-sm mt-2">
                    {story.originalText.slice(0, 120)}…
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-full inline-block">
                    {story.village.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant={liked[story.id] ? 'destructive' : 'outline'} size="sm" onClick={async (e) => {
                      e.stopPropagation();
                      const token = localStorage.getItem('token');
                      if (!token) { alert('Log in to like stories'); return; }

                      setAnimating(prev => ({ ...prev, [story.id]: true }));
                      setTimeout(() => setAnimating(prev => ({ ...prev, [story.id]: false })), 450);

                      try {
                        const res = await authFetch(`${API_URL}/api/stories/${story.id}/like`, { method: 'POST' });
                        if (!res.ok) throw new Error();
                        const data = await res.json();
                        setLikesCount(prev => ({ ...prev, [story.id]: data.likesCount }));
                        setLiked(prev => ({ ...prev, [story.id]: data.liked }));
                      } catch {
                        alert('Failed to like');
                      }
                    }}>
                      <Heart className={"w-4 h-4 " + (animating[story.id] ? 'animate-pulse' : '')} />
                      {likesCount[story.id] ? `${likesCount[story.id]} • ` : ''}{liked[story.id] ? 'Liked' : 'Like'}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={async (e) => {
                      e.stopPropagation();
                      const text = `${story.title} — ${story.originalText.slice(0,120)}…\n\nRead more on The Villagers.`;
                      try {
                        if (navigator.share) {
                          await navigator.share({ title: story.title, text });
                        } else if (navigator.clipboard) {
                          await navigator.clipboard.writeText(text);
                          toast({ title: 'Copied', description: 'Story copied to clipboard' });
                        }
                      } catch (err) {
                        alert('Unable to share');
                      }
                    }}>
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activeStory && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center"
              onClick={() => setActiveStory(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-2xl max-w-2xl"
              >
                <h2 className="text-2xl font-serif mb-4">
                  {activeStory.title}
                </h2>
                <p>{activeStory.originalText}</p>
                  <div className="mt-6 flex gap-2 justify-end">
                    <Button variant={liked[activeStory.id] ? 'destructive' : 'outline'} onClick={async () => {
                      const token = localStorage.getItem('token');
                      if (!token) { alert('Log in to like stories'); return; }

                      setAnimating(prev => ({ ...prev, [activeStory.id]: true }));
                      setTimeout(() => setAnimating(prev => ({ ...prev, [activeStory.id]: false })), 450);

                      try {
                        const res = await authFetch(`${API_URL}/api/stories/${activeStory.id}/like`, { method: 'POST' });
                        if (!res.ok) throw new Error();
                        const data = await res.json();
                        setLikesCount(prev => ({ ...prev, [activeStory.id]: data.likesCount }));
                        setLiked(prev => ({ ...prev, [activeStory.id]: data.liked }));
                      } catch { alert('Failed to like'); }
                    }}>
                      <Heart className={"w-4 h-4 " + (animating[activeStory.id] ? 'animate-pulse' : '')} /> {likesCount[activeStory.id] ? `${likesCount[activeStory.id]} • ` : ''}{liked[activeStory.id] ? 'Liked' : 'Like'}
                    </Button>

                    <Button variant="ghost" onClick={async () => {
                      const text = `${activeStory.title} — ${activeStory.originalText.slice(0,120)}…\n\nRead more on The Villagers.`;
                      try {
                        if (navigator.share) await navigator.share({ title: activeStory.title, text });
                        else { await navigator.clipboard.writeText(text); toast({ title: 'Copied', description: 'Story copied to clipboard' }); }
                      } catch { alert('Unable to share'); }
                    }}>Share</Button>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* EDIT STORY MODAL */}
      {editingStory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Edit Story</h2>
            <input className="w-full border p-3 rounded mb-3" value={editingStory.title} onChange={e => setEditingStory({ ...editingStory, title: e.target.value })} />
            <textarea className="w-full border p-3 rounded mb-3" rows={6} value={editingStory.originalText} onChange={e => setEditingStory({ ...editingStory, originalText: e.target.value })} />
            <div className="flex gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={async () => {
                  setEditStorySubmitting(true);
                  try {
                    const res = await authFetch(`${API_URL}/api/stories/${editingStory.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: editingStory.title, originalText: editingStory.originalText, originalLang: 'en' }) });
                    if (!res.ok) throw new Error();
                    const updated = await res.json();
                    setAllStories(prev => prev.map(s => s.id === updated.id ? updated : s));
                    setVisibleStories(prev => prev.map(s => s.id === updated.id ? updated : s));
                    setEditingStory(null);
                  } catch {
                    alert('Failed to update story');
                  } finally { setEditStorySubmitting(false); }
                }}
              >{editStorySubmitting ? 'Saving...' : 'Save'}</Button>
              <Button variant="secondary" size="sm" onClick={() => setEditingStory(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}
