import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryBookProps {
  title: string;
  content: string;
  image?: string;
}

/**
 * Split text into readable "pages" by words, not raw characters
 */
function paginateText(text: string, maxChars = 420) {
  const words = text.split(" ");
  const pages: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).length > maxChars) {
      pages.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }

  if (current.trim()) pages.push(current.trim());
  return pages;
}

export default function StoryBook({
  title,
  content,
  image,
}: StoryBookProps) {
  const pages = useMemo(() => paginateText(content), [content]);
  const [page, setPage] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" && page < pages.length - 1) {
        setPage((p) => p + 1);
      }
      if (e.key === "ArrowLeft" && page > 0) {
        setPage((p) => p - 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [page, pages.length]);

  return (
    <div className="bg-[#fdf8f2] shadow-xl rounded-2xl p-6 w-full max-w-md overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ rotateY: 75, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -75, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{ transformPerspective: 1200 }}
          className="min-h-[340px] max-h-[440px] overflow-hidden"
        >
          {/* Cover Image (only on first page) */}
          {page === 0 && image && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-xl mb-3 text-gray-900">
            {title}
          </h3>

          {/* Page Text */}
          <div className="max-w-prose">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {pages[page]}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="disabled:opacity-30 hover:text-black transition"
        >
          ◀ Prev
        </button>

        <span className="text-xs">
          Page {page + 1} of {pages.length}
        </span>

        <button
          disabled={page === pages.length - 1}
          onClick={() => setPage((p) => p + 1)}
          className="disabled:opacity-30 hover:text-black transition"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
