import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * Custom hook for folder operations that properly handles cache invalidation
 * across different query keys
 */
export const useFolderOperations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Mutation for renaming a folder
  const renameFolderMutation = useMutation({
    mutationFn: async ({
      folderId,
      newName,
    }: {
      folderId: string;
      newName: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");

      // Get the folders document
      const foldersDocRef = doc(db, "users", userId, "data", "folders");
      const foldersDoc = await getDoc(foldersDocRef);

      if (!foldersDoc.exists()) {
        throw new Error("Folders document not found");
      }

      const foldersData = foldersDoc.data();
      const folderData = foldersData[folderId];

      if (!folderData) {
        throw new Error("Folder not found");
      }

      // Update the folder name while preserving other data
      const updatedFolderData = {
        ...foldersData,
        [folderId]: {
          ...folderData,
          name: newName,
        },
      };

      await setDoc(foldersDocRef, updatedFolderData);
      return { folderId, newName };
    },
    onSuccess: () => {
      // Invalidate both query types to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["foldersList", userId] });
      queryClient.invalidateQueries({ queryKey: ["foldersWithLinks", userId] });
      toast.success("Folder renamed successfully!");
    },
    onError: (error) => {
      console.error("Error renaming folder:", error);
      toast.error(
        error instanceof Error ? error.message : "Error renaming folder"
      );
    },
  });

  // Mutation for deleting a folder
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      if (!userId) throw new Error("User not authenticated");

      // Get the folders document
      const foldersDocRef = doc(db, "users", userId, "data", "folders");
      const foldersDoc = await getDoc(foldersDocRef);

      if (!foldersDoc.exists()) {
        throw new Error("Folders document not found");
      }

      const foldersData = foldersDoc.data();

      // Create a new object without the folder to delete
      const { [folderId]: removedFolder, ...remainingFolders } = foldersData;

      if (!removedFolder) {
        throw new Error("Folder not found");
      }

      // Update the folders document without the deleted folder
      await setDoc(foldersDocRef, remainingFolders);
      return folderId;
    },
    onSuccess: () => {
      // Invalidate both query types to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["foldersList", userId] });
      queryClient.invalidateQueries({ queryKey: ["foldersWithLinks", userId] });
      queryClient.invalidateQueries({ queryKey: ["allBookmarks", userId] });
      toast.success("Folder deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting folder:", error);
      toast.error(
        error instanceof Error ? error.message : "Error deleting folder"
      );
    },
  });

  return {
    renameFolderMutation,
    deleteFolderMutation,
  };
};
