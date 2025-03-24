import React from "react";
import CreateNewFolder from "@/components/CreateNewFolder";
import CreateNewBookmark from "./CreateNewBookmark";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppProvider";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";

const fetchFolders = async (userId: string) => {
  if (!userId) return [];

  const foldersRef = ref(db, `users/${userId}/folders`);
  return new Promise((resolve, reject) => {
    onValue(
      foldersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const foldersData = snapshot.val();
          const foldersArray = Object.keys(foldersData).map((id) => ({
            id,
            ...foldersData[id],
          }));
          resolve(foldersArray);
        } else {
          resolve([]);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export default function Home() {
  const { user } = useAppContext();

  const { data: folders } = useQuery({
    queryKey: ["folders", user?.uid],
    queryFn: () => fetchFolders(user?.uid ?? ""),
    enabled: !!user?.uid,
  });

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Bookmarks</h1>
        <div>
          <CreateNewBookmark folders={folders} />
          {/* <CreateNewFolder /> */}
        </div>
      </div>
    </div>
  );
}
