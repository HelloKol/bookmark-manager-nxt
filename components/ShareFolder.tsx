import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Adjust the path as necessary
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

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
  // Setup sharing mutation
  const shareFolderMutation = useMutation({
    mutationFn: async () => {
      const sharedFolderDocRef = doc(db, "sharedFolders", folderId);
      await setDoc(sharedFolderDocRef, {
        ...folderData,
        ownerId: userId,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      try {
        // Generate shareable link
        const shareableLink = `http://app.localhost:3000/share/${folderId}`;
        navigator.clipboard.writeText(shareableLink).catch((error) => {
          console.log("Failed to copy link: ", error);
        });
        toast.success("Folder shared successfully!");
      } catch (error) {
        console.error("Error generating link:", error);
        toast.success("Folder shared successfully! (Failed to copy link)");
      }
    },
    onError: (error) => {
      console.error("Error sharing folder:", error);
      toast.error("Error sharing folder");
    },
  });

  const handleShare = async () => {
    shareFolderMutation.mutate();
  };

  return (
    <span
      onClick={handleShare}
      className={`cursor-pointer ${
        shareFolderMutation.isPending ? "opacity-50" : ""
      }`}
      style={{ pointerEvents: shareFolderMutation.isPending ? "none" : "auto" }}
    >
      {shareFolderMutation.isPending ? "Sharing..." : "Share Folder"}
    </span>
  );
}
