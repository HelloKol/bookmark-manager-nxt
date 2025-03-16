import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppContext } from "@/context/AppProvider";

interface Folder {
  id: string;
  name: string;
  slug: string;
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
}

interface Props {
  user: User | null;
}

export default function FolderList({ user }: Props) {
  const { searchTerm } = useAppContext();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const foldersRef = ref(db, `users/${user.uid}/folders`);
    const unsubscribe = onValue(foldersRef, (snapshot) => {
      const data = snapshot.val();
      const folderArray: Folder[] = [];

      if (data) {
        Object.entries(data).forEach(([key, value]: any) => {
          folderArray.push({
            id: key,
            name: value.name,
            slug: value.slug,
          });
        });
      }

      setFolders(folderArray);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, [user]);

  // Filter links based on searchTerm
  const filteredLinks = searchTerm
    ? folders.filter((folder) => {
        const searchLower = searchTerm.toLowerCase();
        return folder.name?.toLowerCase().includes(searchLower);
      })
    : folders;

  if (loading) return <p>Loading folders...</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {folders.length === 0 && <p>No folders found.</p>}

      <div className="flex gap-4">
        {filteredLinks.map((folder) => (
          <Link
            key={folder.id}
            href={`/folder/${folder.slug}`}
            className="block col-span-2 p-4 text-white  ursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/macos-folder.png"
              alt="Vercel Logo"
              className="block w-32 cursor-pointer"
            />
            {folder.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
