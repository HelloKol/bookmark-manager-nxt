import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ref, push, set } from "firebase/database";
import { auth, db } from "@/lib/firebase"; // Assuming you have both exported from firebase.ts
import { generateSlug } from "@/lib/utils";

interface CreateNewFolderProps {}

const CreateNewFolder: React.FC<CreateNewFolderProps> = ({}) => {
  const [folderName, setFolderName] = useState("");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create a folder");
      return;
    }

    setLoading(true);
    const slug = generateSlug(folderName);

    try {
      // Get the reference to the user's folders path
      const folderRef = ref(db, `users/${user.uid}/folders`);
      const newFolderRef = push(folderRef); // Create a new folder with a unique ID

      await set(newFolderRef, {
        name: folderName.trim(),
        slug,
        createdAt: Date.now(),
      });

      alert("Folder created successfully!");
      setFolderName("");
      setIsFolderModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error creating folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="rounded-md cursor-pointer bg-indigo-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        type="button"
        onClick={() => setIsFolderModalOpen(true)}
      >
        Create New Folder
      </button>

      {/* Folder Modal */}
      <Dialog.Root open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>

              <input
                type="text"
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />

              <div className="flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                  onClick={() => setIsFolderModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={handleCreateFolder}
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

export default CreateNewFolder;
