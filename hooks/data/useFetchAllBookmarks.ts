import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
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
const fetchBookmarks = (userId: string): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      resolve([]);
      return;
    }

    const foldersRef = ref(db, `users/${userId}/folders`);
    const bookmarksRef = ref(db, `users/${userId}/bookmarks`);

    let allBookmarks: Bookmark[] = [];

    const foldersUnsubscribe = onValue(
      foldersRef,
      (snapshot) => {
        const data: FirebaseFolders | null = snapshot.val();
        if (data) {
          const foldersList: FolderType[] = Object.entries(data).map(
            ([id, folder]) => ({
              id,
              ...folder,
              links: folder.links || {},
            })
          );

          const folderBookmarks: Bookmark[] = foldersList.flatMap((folder) =>
            Object.entries(folder.links).map(([linkId, link]) => ({
              id: linkId,
              ...link,
              folderId: folder.id,
            }))
          );

          allBookmarks = [...allBookmarks, ...folderBookmarks];
        }
      },
      (error) => reject(error)
    );

    const bookmarksUnsubscribe = onValue(
      bookmarksRef,
      (snapshot) => {
        const data: FirebaseBookmarks | null = snapshot.val();
        if (data) {
          const bookmarksList: Bookmark[] = Object.entries(data).map(
            ([id, bookmark]) => ({
              id,
              ...bookmark,
            })
          );

          allBookmarks = [...allBookmarks, ...bookmarksList];
        }
        resolve(allBookmarks);
      },
      (error) => reject(error)
    );

    return () => {
      foldersUnsubscribe();
      bookmarksUnsubscribe();
    };
  });
};

/**
 * Custom hook to fetch all bookmarks (from folders and uncategorized) using React Query.
 */
export const useFetchAllBookmarks = () => {
  const { user } = useAppContext();

  return useQuery<Bookmark[]>({
    queryKey: ["allBookmarks", user?.uid],
    queryFn: () => (user?.uid ? fetchBookmarks(user.uid) : Promise.resolve([])),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Disable automatic retries on error
  });
};
