import { useEffect, useState } from "react";
import { fetchStoriesByVillage } from "@/lib/api";
import { Story } from "@/types";

interface Props {
  villageId: string;
}

export default function StoryList({ villageId }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchStoriesByVillage(villageId);
      setStories(data);
      setLoading(false);
    }
    load();
  }, [villageId]);

  if (loading) return <p>Loading stories…</p>;

  if (stories.length === 0) {
    return <p>No stories yet.</p>;
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <div key={story.id} className="border p-4">
          <h3 className="font-semibold">{story.title}</h3>
          <p className="text-sm text-gray-700">
            {story.originalText}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            by {story.author.email}
          </p>
        </div>
      ))}
    </div>
  );
}
