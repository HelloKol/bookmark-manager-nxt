import React from "react";
import CreateNewBookmark from "./CreateNewBookmark";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BookmarkData {
  requestUrl: string;
  url: string;
  title?: string;
  ogTitle?: string;
  ogDescription?: string;
}

interface FolderData {
  name: string;
  slug: string;
  createdAt: string;
  links?: Record<string, BookmarkData>;
}

interface Folder {
  id: string;
  name: string;
  slug: string;
}

const fetchFolders = async (userId: string): Promise<Folder[]> => {
  if (!userId) return [];

  try {
    const foldersDocRef = doc(db, "users", userId, "data", "folders");
    const foldersSnapshot = await getDoc(foldersDocRef);

    if (!foldersSnapshot.exists()) {
      return [];
    }

    const foldersData = foldersSnapshot.data();
    return Object.entries(foldersData).map(([id, value]) => ({
      id,
      name: (value as FolderData).name,
      slug: (value as FolderData).slug,
    }));
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

export default function Header({ bookmarkLength }: { bookmarkLength: number }) {
  const { user } = useAppContext();

  const {
    data: folders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders", user?.uid],
    queryFn: () => fetchFolders(user?.uid ?? ""),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) return <div>Loading folders...</div>;
  if (error) return <div>Error loading folders</div>;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          My Bookmarks ({bookmarkLength})
        </h1>
        <div>
          <CreateNewBookmark folders={folders} />
        </div>
      </div>
    </div>
  );
}
