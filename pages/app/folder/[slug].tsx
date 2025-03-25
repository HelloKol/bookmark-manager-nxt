import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useAppContext } from "@/context/AppProvider";
import Bookmarks from "@/components/Bookmarks";
import CreateNewBookmark from "@/components/CreateNewBookmark";
import DeleteAllBookmark from "@/components/DeleteAllBookmark";
import ImportBookmark from "@/components/ImportBookmark";

interface FolderType {
  id: string;
  name: string;
  slug: string;
}

const FolderPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [folder, setFolder] = useState<FolderType | null>(null);
  const [allfolder, setAllFolder] = useState<FolderType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { slug } = router.query;

  useEffect(() => {
    if (!user || !slug) return;

    setLoading(true);

    const foldersRef = ref(db, `users/${user.uid}/folders`);

    const unsubscribe = onValue(foldersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setFolder(null);
        setLoading(false);
        return;
      }

      const foldersList: FolderType[] = Object.values(data);
      setAllFolder(foldersList);

      const folderEntry = Object.entries(data).find(
        ([, value]: any) => value.slug === slug
      );

      if (folderEntry) {
        const [id, folderData]: any = folderEntry;
        setFolder({ id, ...folderData });
      } else {
        setFolder(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, slug]);

  if (loading) return <p>Loading folder...</p>;

  if (!folder) return <p>Folder not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Folder: {folder.name}</h1>{" "}
      <div className="flex justify-end w-full mb-4">
        <DeleteAllBookmark folderId={folder.id} />
        <CreateNewBookmark folderId={folder.id} folders={allfolder} />
        <ImportBookmark folderId={folder?.id} />
      </div>
      <Bookmarks user={user} folderId={folder.id} />
    </div>
  );
};

export default FolderPage;
