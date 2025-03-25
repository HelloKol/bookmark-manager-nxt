import React from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppContext } from "@/context/AppProvider";
import Bookmarks from "@/components/Bookmarks";
import CreateNewBookmark from "@/components/CreateNewBookmark";
import DeleteAllBookmark from "@/components/DeleteAllBookmark";
import ImportBookmark from "@/components/ImportBookmark";
import { useQuery } from "@tanstack/react-query";

interface BookmarkData {
  requestUrl: string;
  url: string;
  title?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string }[];
}

interface FolderData {
  name: string;
  slug: string;
  createdAt: string;
  links?: Record<string, BookmarkData>;
}

interface FolderType {
  id: string;
  name: string;
  slug: string;
}

/**
 * Fetches all folders for a user from Firestore
 */
const fetchFolders = async (userId: string): Promise<FolderType[]> => {
  if (!userId) {
    return [];
  }

  const foldersDocRef = doc(db, "users", userId, "data", "folders");
  const snapshot = await getDoc(foldersDocRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data() as Record<string, FolderData>;

  return Object.entries(data).map(([id, value]) => ({
    id,
    name: value.name,
    slug: value.slug,
  }));
};

const FolderPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const { slug } = router.query;

  // Fetch all folders with TanStack Query
  const foldersQuery = useQuery({
    queryKey: ["folders", user?.uid],
    queryFn: () => fetchFolders(user?.uid || ""),
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Find the current folder based on the slug
  const folder = foldersQuery.data?.find((f) => f.slug === slug);

  if (foldersQuery.isLoading) return <p>Loading folder...</p>;
  if (foldersQuery.isError)
    return <p>Error loading folder: {(foldersQuery.error as Error).message}</p>;
  if (!folder) return <p>Folder not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Folder: {folder.name}</h1>{" "}
      <div className="flex justify-end w-full mb-4">
        <DeleteAllBookmark folderId={folder.id} />
        <CreateNewBookmark
          folderId={folder.id}
          folders={foldersQuery.data || []}
        />
        <ImportBookmark folderId={folder?.id} />
      </div>
      <Bookmarks user={user} folderId={folder.id} />
    </div>
  );
};

export default FolderPage;
