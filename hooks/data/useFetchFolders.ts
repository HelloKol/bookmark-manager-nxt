import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bookmark } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Folder {
  id: string;
  name: string;
  slug: string;
  links?: Record<string, Omit<Bookmark, "id">>; // Optional: Include links if needed
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; folders: Folder[] };

/**
 * Fetches folders from Firestore
 * @param userId - The user's ID
 * @returns A promise resolving to an array of folders
 */
const fetchFolders = async (userId: string): Promise<Folder[]> => {
  if (!userId) {
    return [];
  }

  const foldersDocRef = doc(db, "users", userId, "data", "folders");
  const snapshot = await getDoc(foldersDocRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data();

  return Object.entries(data || {}).map(([key, value]) => ({
    id: key,
    name: value.name,
    slug: value.slug,
    links: value.links || {},
  }));
};

export const useFetchFolders = (
  userId: string | null,
  userLoading: string
): FetchState => {
  const query = useQuery({
    queryKey: ["folders", userId],
    queryFn: () => fetchFolders(userId || ""),
    enabled: !!userId && userLoading !== "loading",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (query.isLoading || userLoading === "loading") {
    return { status: "loading" };
  }

  if (query.isError) {
    return { status: "error", error: (query.error as Error).message };
  }

  if (!userId) {
    return { status: "error", error: "No user ID provided" };
  }

  return { status: "success", folders: query.data || [] };
};
