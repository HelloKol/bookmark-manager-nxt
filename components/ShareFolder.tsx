import React from "react";
import { ref, set } from "firebase/database";
import { db } from "../lib/firebase"; // Adjust the path as necessary
import { toast } from "react-toastify";

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
    const createSharePromise = new Promise<void>(async (resolve, reject) => {
      try {
        const sharedFolderRef = ref(db, `sharedFolders/${folderId}`);
        await set(sharedFolderRef, {
          ...folderData,
          ownerId: userId,
        });

        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });

    // Use toast.promise to handle loading, success, and error states
    toast.promise(createSharePromise, {
      pending: "Shariing folder...",
      success: {
        render() {
          try {
            // Generate shareable link
            const shareableLink = `http://app.localhost:3000/share/${folderId}`;
            navigator.clipboard.writeText(shareableLink).catch((error) => {
              console.log("Failed to copy link: ", error);
            });
          } catch (error) {
            console.log(error);
          }

          return `Folder shared successfully!`;
        },
      },
      error: {
        render: "Error shariing folder",
      },
    });
  };

  return <span onClick={handleShare}>Share Folder</span>;
}
