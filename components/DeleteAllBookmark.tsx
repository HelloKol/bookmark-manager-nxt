import React, { useState } from "react";
import { ref, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useAppContext } from "@/context/AppProvider";
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

  const handleRemoveAllBookmarks = async () => {
    if (!user || !folderId) return;
    setIsFolderModalOpen(false);

    // Wrap the deletion logic in a promise
    const removeBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          const bookmarksRef = ref(
            db,
            `users/${user.uid}/folders/${folderId}/links`
          );
          await remove(bookmarksRef); // Remove all bookmarks
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );

    // Use toast.promise to handle loading, success, and error states
    toast.promise(removeBookmarksPromise, {
      pending: "Removing all bookmarks...",
      success: "All bookmarks removed successfully!",
      error: "Error removing bookmarks",
    });
  };

  return (
    <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
      <DialogTrigger asChild>
        <Button>Remove All Bookmarks</Button>
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
          <Button type="submit" onClick={handleRemoveAllBookmarks}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllBookmark;
