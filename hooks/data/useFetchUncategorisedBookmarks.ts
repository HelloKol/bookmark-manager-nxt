import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAppContext } from "@/context/AppProvider";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string;
}

type FirebaseBookmarks = Record<string, Omit<Bookmark, "id">>;

/**
 * Fetches bookmarks from Firebase.
 * @param userId - The user's ID.
 * @returns A promise resolving to an array of bookmarks.
 */
const fetchBookmarks = async (userId: string): Promise<Bookmark[]> => {
  if (!userId) {
    return [];
  }

  const bookmarksDocRef = doc(db, "users", userId, "data", "bookmarks");
  const snapshot = await getDoc(bookmarksDocRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data() as FirebaseBookmarks;

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
};

/**
 * Custom hook to fetch uncategorized bookmarks using React Query.
 */
export const useFetchUncategorisedBookmarks = () => {
  const { user } = useAppContext();

  return useQuery<Bookmark[]>({
    queryKey: ["uncategorizedBookmarks", user?.uid],
    queryFn: () => (user?.uid ? fetchBookmarks(user.uid) : Promise.resolve([])),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Disable automatic retries on error
  });
};
