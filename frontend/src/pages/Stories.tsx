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
    title: "Grandmother’s Secret Recipe",
    originalText:
      "The aroma of freshly ground spices filled the air. My grandmother’s curry recipe has been passed down for generations in our village.",
    createdAt: new Date().toISOString(),
    author: { email: "cook@village.com" },
    village: { id: "v2", name: "Lakshmipur", pincode: "654321" },
  },
  {
    id: "mock3",
    title: "The Old Banyan Tree",
    originalText:
      "Under the ancient banyan tree, the elders once held village meetings. It still stands tall, witnessing decades of change.",
    createdAt: new Date().toISOString(),
    author: { email: "historian@village.com" },
    village: { id: "v3", name: "Ramapur", pincode: "789456" },
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Stories() {
  const [allStories, setAllStories] = useState<Story[]>(mockStories);
  const [visibleStories, setVisibleStories] = useState<Story[]>(mockStories);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [loadingVillages, setLoadingVillages] = useState(false);

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
        if (data.length > 0) {
          setAllStories(data);
          setVisibleStories(data);
        }
      })
      .catch(() => {
        // keep mock stories if backend fails
      });
  }, []);

  /* ---------------- FIND VILLAGES (FILTER) ---------------- */

  async function findVillages() {
    if (pincode.length !== 6 || !API_URL) return;

    setLoadingVillages(true);
    setVillages([]);
    setSelectedVillage(null);

    try {
      const res = await fetch(`${API_URL}/api/pincodes/${pincode}`);
      if (!res.ok) return;

      const data = await res.json();
      const list: Village[] = data.villages || [];
      setVillages(list);

      if (list.length === 1) {
        applyVillageFilter(list[0]);
      }
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
    setVisibleStories(allStories);
  }

  /* ---------------- FORM PINCODE ---------------- */

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

      setAllStories((prev) => [newStory, ...prev]);
      setVisibleStories((prev) => [newStory, ...prev]);

      setShowForm(false);
      setEmail("");
      setTitle("");
      setText("");
      setFormPincode("");
      setFormVillage(null);
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
    transition={{ duration: 0.3 }}
    className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl space-y-8 border border-gray-100"
  >
    {/* 🌈 Gradient Heading */}
    <h2 className="text-3xl font-serif font-bold text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      Share Your Village Story
    </h2>

    {/* Email */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        Your Email
      </label>
      <input
        className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Title */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        Story Title
      </label>
      <input
        className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition"
        placeholder="Give your story a beautiful title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    {/* Story Text */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        Your Story
      </label>
      <textarea
        className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
        rows={6}
        placeholder="Write your village story here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>

    {/* Pincode */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        Village Pincode
      </label>
      <input
        className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition"
        placeholder="Enter 6-digit pincode"
        value={formPincode}
        onChange={(e) =>
          setFormPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
      />
    </div>

    {/* Village Dropdown */}
    {formVillages.length > 1 && (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Select Village
        </label>
        <select
          className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={formVillage?.id || ""}
          onChange={(e) =>
            setFormVillage(
              formVillages.find((v) => v.id === e.target.value) || null
            )
          }
        >
          <option value="">Choose your village</option>
          {formVillages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
    )}

    {formVillages.length === 1 && formVillage && (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Selected Village
        </label>
        <input
          className="w-full border border-gray-200 p-4 rounded-2xl bg-gray-100"
          value={formVillage.name}
          readOnly
        />
      </div>
    )}

    {/* Submit Button */}
    <button
      onClick={submitStory}
      disabled={submitting || !formVillage}
      className={`w-full py-4 rounded-2xl font-medium transition ${
        submitting || !formVillage
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-black text-white hover:opacity-90"
      }`}
    >
      {submitting ? "Publishing Story..." : "Publish Story"}
    </button>
  </motion.div>
)}


          {/* FILTER SECTION */}
          <div className="flex gap-4 items-center">
            <input
              className="border px-4 py-2 rounded-xl"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />

            <button
              onClick={findVillages}
              disabled={pincode.length !== 6 || loadingVillages}
              className={`px-5 py-2 rounded-xl ${
                pincode.length === 6
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {loadingVillages ? "Searching..." : "Find Village"}
            </button>

            {selectedVillage && (
              <button onClick={clearFilter} className="text-sm underline">
                Clear
              </button>
            )}
          </div>

          {/* STORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {visibleStories.map((story) => (
              <motion.div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="cursor-pointer bg-[#fdf8f2] shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
              >
                <h3 className="font-serif text-xl mb-2">{story.title}</h3>
                <p className="text-sm mb-4">
                  {story.originalText.slice(0, 120)}…
                </p>
                <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                  {story.village.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activeStory && (
            <motion.div
              className="fixed inset-0 bg-[#faf7f2]/90 backdrop-blur-md"
              onClick={() => setActiveStory(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl mx-auto py-24 px-6"
              >
                <h2 className="font-serif text-3xl mb-6">
                  {activeStory.title}
                </h2>
                <p className="whitespace-pre-wrap">
                  {activeStory.originalText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
