import { useQuery } from "@tanstack/react-query";
import { ref, onValue } from "firebase/database";
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
const fetchBookmarks = (userId: string): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve([]);
      return;
    }

    const bookmarksRef = ref(db, `users/${userId}/bookmarks`);

    const unsubscribe = onValue(
      bookmarksRef,
      (snapshot) => {
        const data: FirebaseBookmarks | null = snapshot.val();

        const bookmarks: Bookmark[] = data
          ? Object.entries(data).map(([id, value]) => ({
              id,
              ...value,
            }))
          : [];

        resolve(bookmarks);
      },
      (error) => {
        reject(error);
      }
    );

    return () => unsubscribe(); // Cleanup subscription
  });
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
