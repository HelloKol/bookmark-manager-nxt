import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppContext } from "@/context/AppProvider";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string;
}

interface FolderType {
  id: string;
  name: string;
  slug: string;
  links: Record<string, Omit<Bookmark, "id">>;
}

type FirebaseFolders = Record<string, Omit<FolderType, "id">>;
type FirebaseBookmarks = Record<string, Omit<Bookmark, "id">>;

/**
 * Fetches all bookmarks (both uncategorized and those inside folders) from Firebase.
 * @param userId - The user's ID.
 * @returns A promise resolving to an array of bookmarks.
 */
const fetchBookmarks = async (userId: string): Promise<Bookmark[]> => {
  if (!userId) {
    return [];
  }

  const foldersDocRef = doc(db, "users", userId, "data", "folders");
  const bookmarksDocRef = doc(db, "users", userId, "data", "bookmarks");

  let allBookmarks: Bookmark[] = [];

  // Get folders bookmarks
  const foldersSnapshot = await getDoc(foldersDocRef);
  if (foldersSnapshot.exists()) {
    const data = foldersSnapshot.data() as FirebaseFolders;

    const foldersList: FolderType[] = Object.entries(data).map(
      ([id, folder]) => ({
        id,
        ...folder,
        links: folder.links || {},
      })
    );

    const folderBookmarks: Bookmark[] = foldersList.flatMap((folder) =>
      Object.entries(folder.links || {}).map(([linkId, link]) => ({
        id: linkId,
        ...link,
        folderId: folder.id,
      }))
    );

    allBookmarks = allBookmarks.concat(folderBookmarks);
  }

  // Get uncategorized bookmarks
  const bookmarksSnapshot = await getDoc(bookmarksDocRef);
  if (bookmarksSnapshot.exists()) {
    const data = bookmarksSnapshot.data() as FirebaseBookmarks;

    const bookmarksList: Bookmark[] = Object.entries(data).map(
      ([id, bookmark]) => ({
        id,
        ...bookmark,
        folderId: "", // Ensure these are marked as non-folder bookmarks
      })
    );

    allBookmarks = allBookmarks.concat(bookmarksList);
  }

  return allBookmarks;
};

/**
 * Custom hook to fetch all bookmarks (from folders and uncategorized) using React Query.
 */
export const useFetchAllBookmarks = () => {
  const { user } = useAppContext();

  return useQuery<Bookmark[]>({
    queryKey: ["allBookmarks", user?.uid],
    queryFn: () => fetchBookmarks(user?.uid || ""),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Disable automatic retries on error
  });
};
