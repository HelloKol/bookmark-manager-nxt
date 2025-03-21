import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ref, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useAppContext } from "@/context/AppProvider";

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
    <>
      <button
        className="rounded-md cursor-pointer bg-red-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={() => setIsFolderModalOpen(true)}
      >
        Remove All Bookmarks
      </button>

      {/* Folder Modal */}
      <Dialog.Root open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 outline-none top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg">
            <div className="bg-[#242424] rounded-lg shadow-lg p-6 w-[500px]">
              <h2 className="text-lg font-semibold mb-4">
                Remove all bookmarks
              </h2>
              <p>
                Are you sure you want to remove all bookmarks? All of your data
                will be permanently removed. This action cannot be undone.
              </p>

              <div className="flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                  onClick={() => setIsFolderModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={handleRemoveAllBookmarks}
                >
                  Save
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default DeleteAllBookmark;
