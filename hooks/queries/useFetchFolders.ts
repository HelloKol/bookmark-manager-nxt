import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bookmark } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppProvider";

// Basic folder info without links
interface FolderBasic {
  id: string;
  name: string;
  slug: string;
}

// Complete folder info with links
interface FolderDetailed extends FolderBasic {
  links: Record<string, Omit<Bookmark, "id">>;
}

/**
 * Fetches basic folder information from Firestore (without links)
 * @param userId - The user's ID
 * @returns A promise resolving to an array of basic folder information
 */
const fetchFoldersList = async (
  userId: string | undefined
): Promise<FolderBasic[]> => {
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
  }));
};

/**
 * Fetches complete folder information from Firestore (including links)
 * @param userId - The user's ID
 * @returns A promise resolving to an array of detailed folder information
 */
const fetchFoldersWithLinks = async (
  userId: string | undefined
): Promise<FolderDetailed[]> => {
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

/**
 * Hook to fetch basic folder list (without links)
 * Use this hook when you only need folder metadata (name, slug)
 */
export const useFetchFoldersList = (): UseQueryResult<FolderBasic[], Error> => {
  const { user } = useAppContext();
  return useQuery({
    queryKey: ["foldersList", user?.uid],
    queryFn: () => fetchFoldersList(user?.uid),
    enabled: !!user?.uid,
  });
};

/**
 * Hook to fetch complete folder data (including links)
 * Use this hook when you need access to the bookmark links within folders
 */
export const useFetchFoldersWithLinks = (): UseQueryResult<
  FolderDetailed[],
  Error
> => {
  const { user } = useAppContext();
  return useQuery({
    queryKey: ["foldersWithLinks", user?.uid],
    queryFn: () => fetchFoldersWithLinks(user?.uid),
    enabled: !!user?.uid,
  });
};

// Maintaining backward compatibility for existing code
export const useFetchFolders = useFetchFoldersWithLinks;
