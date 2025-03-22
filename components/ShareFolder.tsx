import React from "react";
import { ref, set } from "firebase/database";
import { db } from "../lib/firebase"; // Adjust the path as necessary

interface Folder {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  userId: string;
  folderId: string;
  folderData: Folder;
}

export default function ShareFolder({ userId, folderId, folderData }: Props) {
  const handleShare = async () => {
    // Copy folder data to sharedFolders
    const sharedFolderRef = ref(db, `sharedFolders/${folderId}`);
    await set(sharedFolderRef, {
      ...folderData,
      ownerId: userId, // Optional: Track the owner
    });

    // Generate shareable link
    const shareableLink = `http://app.localhost:3000/share/${folderId}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
      });
  };

  return (
    <div className="mb-4">
      <button onClick={handleShare}>Share Folder</button>
    </div>
  );
}
