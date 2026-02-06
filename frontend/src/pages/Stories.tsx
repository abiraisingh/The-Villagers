import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPincode, fetchStoriesByVillage } from "@/lib/api";
import { Village, Story } from "@/types";

/* ---------------- STORY BOOK ---------------- */

function StoryBook({
  title,
  image,
  content,
  compact = false,
}: {
  title: string;
  image?: string;
  content: string;
  compact?: boolean;
}) {
  const pages = content.match(/.{1,420}/g) || [];
  const [page, setPage] = useState(0);

  return (
    <motion.div
      layout
      className="bg-[#fdf8f2] shadow-xl rounded-2xl p-8 w-full max-w-xl overflow-hidden"
    >
      {page === 0 && image && (
        <img
          src={image}
          alt={title}
          className="rounded-xl mb-5 object-cover h-56 w-full"
        />
      )}

      <h3 className="font-serif text-2xl mb-4">{title}</h3>

      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
        {pages[page]}
      </p>

      {!compact && (
        <div className="flex justify-between mt-6 text-gray-500">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-30"
          >
            ◀ Prev
          </button>
          <span>
            Page {page + 1} / {pages.length}
          </span>
          <button
            disabled={page === pages.length - 1}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-30"
          >
            Next ▶
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function Stories() {
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showForm, setShowForm] = useState(false);

  /* FORM STATE */
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  /* ESC closes fullscreen */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveStory(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handlePincodeSearch() {
    const data = await fetchPincode(pincode);
    setVillages(data.villages);
    setSelectedVillage(null);
    setStories([]);
  }

  async function handleVillageSelect(village: Village) {
    setSelectedVillage(village);
    const data = await fetchStoriesByVillage(village.id);
    setStories(data);
  }

  async function createStory() {
    if (!email || !title || !text || !selectedVillage) return;

    setSubmitting(true);

    const res = await fetch("http://localhost:4000/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        originalText: text,
        originalLang: "en",
        villageId: selectedVillage.id,
        authorEmail: email,
        image,
      }),
    });

    const newStory = await res.json();
    newStory.image = image;

    setStories((prev) => [newStory, ...prev]);
    setShowForm(false);

    setEmail("");
    setTitle("");
    setText("");
    setImage(undefined);
    setSubmitting(false);
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 bg-[#faf7f2] border-b">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <h1 className="font-serif text-2xl">Village Stories</h1>

          <div className="flex gap-4">
            <input
              className="border rounded-xl px-5 py-2.5"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button
              onClick={handlePincodeSearch}
              className="bg-black text-white px-6 py-2.5 rounded-xl"
            >
              Find
            </button>

            {selectedVillage && (
              <button
                onClick={() => setShowForm((s) => !s)}
                className="border px-6 py-2.5 rounded-xl hover:bg-black hover:text-white"
              >
                Add Story
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-14 space-y-14">
        {!selectedVillage && villages.length > 0 && (
          <ul className="max-w-md space-y-3">
            {villages.map((v) => (
              <li
                key={v.id}
                onClick={() => handleVillageSelect(v)}
                className="border p-4 rounded-xl cursor-pointer hover:bg-gray-100"
              >
                {v.name}
              </li>
            ))}
          </ul>
        )}

        {selectedVillage && (
          <>
            {/* ADD STORY FORM */}
            {showForm && (
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl space-y-4">
                <input
                  className="border p-3 w-full rounded-xl"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="border p-3 w-full rounded-xl"
                  placeholder="Story title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Add a photo (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        setImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />

                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="mt-3 h-40 rounded-xl object-cover"
                    />
                  )}
                </div>

                <textarea
                  className="border p-3 w-full rounded-xl"
                  rows={5}
                  placeholder="Write your story..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <button
                  onClick={createStory}
                  disabled={submitting}
                  className="bg-black text-white px-6 py-3 rounded-xl"
                >
                  {submitting ? "Publishing..." : "Publish Story"}
                </button>
              </div>
            )}

            {/* STORY GRID */}
            <motion.div
              layout
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 ${
                activeStory ? "blur-sm pointer-events-none" : ""
              }`}
            >
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  layoutId={story.id}
                  onClick={() => setActiveStory(story)}
                  className="cursor-pointer"
                >
                  <StoryBook
                    title={story.title}
                    content={story.originalText.slice(0, 300) + "…"}
                    image={(story as any).image}
                    compact
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* FULLSCREEN STORY */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#faf7f2]/90 backdrop-blur-md"
            onClick={() => setActiveStory(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={activeStory.id}
              className="max-w-4xl mx-auto px-8 py-24"
              onClick={(e) => e.stopPropagation()}
            >
              <StoryBook
                title={activeStory.title}
                content={activeStory.originalText}
                image={(activeStory as any).image}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
