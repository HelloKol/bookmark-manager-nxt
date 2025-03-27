import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useAppContext } from "@/context/AppProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteAllBookmarkProps {
  folderId: string;
}

const DeleteAllBookmark: React.FC<DeleteAllBookmarkProps> = ({
  folderId,
}: DeleteAllBookmarkProps) => {
  const { user } = useAppContext();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const removeAllBookmarksMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid) throw new Error("User not authenticated");

      // Get the folders document
      const foldersDocRef = doc(db, "users", user.uid, "data", "folders");
      const foldersDoc = await getDoc(foldersDocRef);

      if (!foldersDoc.exists()) {
        throw new Error("Folders document not found");
      }

      const foldersData = foldersDoc.data();
      const folderData = foldersData[folderId];

      if (!folderData) {
        throw new Error("Folder not found");
      }

      // Update the folder by removing all links but keeping other folder data
      const updatedFolderData = {
        ...foldersData,
        [folderId]: {
          ...folderData,
          links: {}, // Empty the links object
        },
      };

      await setDoc(foldersDocRef, updatedFolderData);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["foldersList", user?.uid] });
      queryClient.invalidateQueries({
        queryKey: ["foldersWithLinks", user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["links", user?.uid, folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["allBookmarks", user?.uid] });
      toast.success("All bookmarks removed successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error removing bookmarks");
    },
  });

  const handleRemoveAllBookmarks = async () => {
    if (!user || !folderId) return;
    setIsFolderModalOpen(false);

    removeAllBookmarksMutation.mutate();
  };

  return (
    <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
      <DialogTrigger asChild>
        <Button disabled={removeAllBookmarksMutation.isPending}>
          {removeAllBookmarksMutation.isPending
            ? "Removing..."
            : "Remove All Bookmarks"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Remove all bookmarks</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove all bookmarks? All of your data will
            be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFolderModalOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleRemoveAllBookmarks}
            disabled={removeAllBookmarksMutation.isPending}
          >
            {removeAllBookmarksMutation.isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllBookmark;
