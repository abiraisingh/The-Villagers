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

/* ---------------- COMPONENT ---------------- */

export default function Stories() {
  /* ---------- DATA ---------- */
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [visibleStories, setVisibleStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  /* ---------- FILTER ---------- */
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [loadingVillages, setLoadingVillages] = useState(false);

  /* ---------- ADD STORY ---------- */
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
    fetch("http://localhost:4000/api/stories")
      .then((res) => res.json())
      .then((data: Story[]) => {
        setAllStories(data);
        setVisibleStories(data);
      });
  }, []);

  /* ---------------- FIND VILLAGES ---------------- */

  async function findVillages() {
    if (pincode.length !== 6) return;

    setLoadingVillages(true);
    setVillages([]);
    setSelectedVillage(null);

    try {
      const res = await fetch(
        `http://localhost:4000/api/pincodes/${pincode}`
      );
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

  /* ---------------- ADD STORY PINCODE ---------------- */

  useEffect(() => {
    if (formPincode.length !== 6) {
      setFormVillages([]);
      setFormVillage(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(
        `http://localhost:4000/api/pincodes/${formPincode}`
      );
      if (!res.ok) return;

      const data = await res.json();
      const list: Village[] = data.villages || [];

      setFormVillages(list);

      if (list.length === 1) {
        setFormVillage(list[0]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formPincode]);

  /* ---------------- SUBMIT STORY ---------------- */

  async function submitStory() {
    if (!email || !title || !text || !formVillage) return;

    setSubmitting(true);

    const res = await fetch("http://localhost:4000/api/stories", {
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

    const newStory: Story = await res.json();

    setAllStories((p) => [newStory, ...p]);
    setVisibleStories((p) => [newStory, ...p]);

    setShowForm(false);
    setEmail("");
    setTitle("");
    setText("");
    setFormPincode("");
    setFormVillages([]);
    setFormVillage(null);
    setSubmitting(false);
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
              onClick={() => setShowForm((p) => !p)}
              className="border px-6 py-3 rounded-xl hover:bg-black hover:text-white"
            >
              {showForm ? "Close" : "Add Story"}
            </button>
          </div>

          {/* FIND VILLAGE */}
          <div className="flex flex-wrap gap-4 items-center max-w-xl">
            <input
              className="border px-4 py-2 rounded-xl w-full sm:w-auto"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />

            <button
              onClick={findVillages}
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              Find Village
            </button>

            {selectedVillage && (
              <button
                onClick={clearFilter}
                className="text-sm underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* VILLAGE SELECT */}
          {villages.length > 1 && (
            <select
              className="border p-3 rounded-xl max-w-md"
              value={selectedVillage?.id || ""}
              onChange={(e) =>
                applyVillageFilter(
                  villages.find((v) => v.id === e.target.value)!
                )
              }
            >
              <option value="">Select village</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}

          {/* ADD STORY FORM */}
          {showForm && (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl space-y-4">
              <input
                className="border p-3 rounded-xl w-full"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border p-3 rounded-xl w-full"
                placeholder="Story title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="border p-3 rounded-xl w-full"
                rows={5}
                placeholder="Write your story..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                className="border p-3 rounded-xl w-full"
                placeholder="Enter pincode"
                value={formPincode}
                onChange={(e) => setFormPincode(e.target.value)}
              />

              {formVillages.length > 1 && (
                <select
                  className="border p-3 rounded-xl w-full"
                  value={formVillage?.id || ""}
                  onChange={(e) =>
                    setFormVillage(
                      formVillages.find((v) => v.id === e.target.value)!
                    )
                  }
                >
                  <option value="">Select village</option>
                  {formVillages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}

              {formVillages.length === 1 && formVillage && (
                <input
                  className="border p-3 rounded-xl w-full bg-gray-100"
                  value={formVillage.name}
                  readOnly
                />
              )}

              <button
                onClick={submitStory}
                disabled={submitting || !formVillage}
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                {submitting ? "Publishing..." : "Publish Story"}
              </button>
            </div>
          )}

          {/* STORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {visibleStories.map((story) => (
              <motion.div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="cursor-pointer bg-[#fdf8f2] shadow-lg rounded-2xl p-6"
              >
                <h3 className="font-serif text-xl mb-2">{story.title}</h3>
                <p className="text-sm mb-4">
                  {(story.originalText || "").slice(0, 120)}…
                </p>
                <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                  {story.village.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FULL STORY */}
        <AnimatePresence>
          {activeStory && (
            <motion.div
              className="fixed inset-0 z-50 bg-[#faf7f2]/90 backdrop-blur-md"
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
