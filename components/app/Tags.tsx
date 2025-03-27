import { useAppContext } from "@/context/AppProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useQuery } from "@tanstack/react-query";

interface Tag {
  id: string;
  name: string;
  tagColor: string;
}

interface TagData {
  name: string;
  color?: string;
  links?: Record<string, boolean>;
  folders?: Record<string, boolean>;
}

const fetchTags = async (userId: string | undefined): Promise<Tag[]> => {
  if (!userId) return [];

  try {
    const tagsDocRef = doc(db, "users", userId, "data", "tags");
    const snapshot = await getDoc(tagsDocRef);

    if (!snapshot.exists()) return [];

    const tagsData = snapshot.data();
    const tags: Tag[] = [];

    Object.entries(tagsData).forEach(([tagId, tagData]) => {
      tags.push({
        id: tagId,
        name: (tagData as TagData).name,
        tagColor: (tagData as TagData).color || "#000000",
      });
    });

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

export default function Tags() {
  const { user } = useAppContext();

  const {
    data: tags = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(user?.uid),
    enabled: !!user?.uid, // Only fetch when user is available
  });

  if (isLoading) return <div>Loading tags...</div>;
  if (error) return <div>Error loading tags</div>;
  if (tags.length === 0) return null;

  return (
    <div className="flex gap-4 mt-4">
      {tags.map((tag) => (
        <button
          key={tag.id}
          className="border border-black/70 px-3 py-0.5 rounded-full flex gap-1.5 items-center cursor-pointer"
        >
          <span
            className={`h-2 w-2 rounded-full`}
            style={{
              background: tag.tagColor,
            }}
          />
          {tag.name}
        </button>
      ))}
    </div>
  );
}
