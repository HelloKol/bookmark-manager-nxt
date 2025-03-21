import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

interface Folder {
  id: string;
  name: string;
  slug: string;
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; folders: Folder[] };

export const useFetchFolders = (
  userId: string | null,
  userLoading: string
): FetchState => {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });

    if (userLoading === "loading") {
      setState({ status: "loading" });
      return;
    }

    // if (!userId) {
    //   setState({ status: "success", folders: [] });
    //   return;
    // }

    const foldersRef = ref(db, `users/${userId}/folders`);
    const unsubscribe = onValue(
      foldersRef,
      (snapshot) => {
        const data = snapshot.val();
        const folders: Folder[] = data
          ? Object.entries(data).map(([key, value]: any) => ({
              id: key,
              name: value.name,
              slug: value.slug,
            }))
          : [];

        setState({ status: "success", folders });
      },
      (error) => {
        setState({ status: "error", error: error.message });
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId, userLoading]);

  return state;
};
