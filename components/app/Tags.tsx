import { useAppContext } from "@/context/AppProvider";
import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

const fetchUserTags = async (): Promise<Tag[]> => {
  const tagsRef = ref(db, "tags");
  const snapshot = await get(tagsRef);

  if (!snapshot.exists()) return [];

  const tags: Tag[] = [];
  Object.entries(snapshot.val()).forEach(([tagId, tagData]: [string, any]) => {
    tags.push({ id: tagId, name: tagData.name, tagColor: tagData.tagColor });
  });

  return tags;
};

interface Tag {
  id: string;
  name: string;
  tagColor: string;
}

export default function Tags() {
  const { user } = useAppContext();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchTags = async () => {
      const userTags = await fetchUserTags();
      setTags(userTags);
    };

    fetchTags();
  }, [user]);

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
