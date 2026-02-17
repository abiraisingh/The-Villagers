import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";

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

const API_URL = import.meta.env.VITE_API_URL;

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

  /* ---------------- LOAD STORIES ---------------- */

  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/api/stories`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Story[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllStories((prev) => [...data, ...prev]);
          setVisibleStories((prev) => [...data, ...prev]);
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
      const res = await fetch(`${API_URL}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          originalText: text,
          originalLang: "en",
          villageId: formVillage.id,
          authorEmail: email,
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
      <div className="bg-[#faf7f2] min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-14 space-y-10">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-3xl">Village Stories</h1>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="border px-6 py-3 rounded-xl hover:bg-black hover:text-white transition"
            >
              {showForm ? "Close" : "Add Story"}
            </button>
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

              <button
                onClick={submitStory}
                disabled={submitting || !formVillage}
                className={`w-full py-3 rounded-xl ${
                  submitting || !formVillage
                    ? "bg-gray-300 text-gray-500"
                    : "bg-black text-white"
                }`}
              >
                {submitting ? "Publishing..." : "Publish Story"}
              </button>
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

              <button
                onClick={findVillages}
                disabled={pincode.length !== 6 || loadingVillages}
                className="px-5 py-2 rounded-xl bg-black text-white"
              >
                {loadingVillages ? "Searching..." : "Find Village"}
              </button>

              {selectedVillage && (
                <button onClick={clearFilter} className="underline">
                  Clear
                </button>
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
                onClick={() => setActiveStory(story)}
                className="cursor-pointer bg-white p-6 rounded-2xl shadow"
              >
                <h3 className="text-xl font-serif">{story.title}</h3>
                <p className="text-sm mt-2">
                  {story.originalText.slice(0, 120)}…
                </p>
                <span className="text-xs bg-black text-white px-2 py-1 rounded-full mt-3 inline-block">
                  {story.village.name}
                </span>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
