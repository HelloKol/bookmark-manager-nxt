import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { generateSlug } from "@/lib/utils";
import { toast } from "react-toastify";
import Dialog from "@/components/RadixUI/Dialog";

const CreateNewFolder: React.FC = () => {
  const [folderName, setFolderName] = useState("");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

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

    const slug = generateSlug(folderName);

    const createFolderPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const folderRef = ref(db, `users/${user.uid}/folders`);
        const newFolderRef = push(folderRef); // Create a new folder with a unique ID

        await set(newFolderRef, {
          name: folderName.trim(),
          slug,
          createdAt: Date.now(),
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // Use toast.promise to handle loading, success, and error states
    toast.promise(createFolderPromise, {
      pending: "Creating folder...",
      success: {
        render: "Folder created successfully!",
        onClose: () => {
          setFolderName("");
          setIsFolderModalOpen(false);
        },
      },
      error: {
        render: "Error creating folder",
      },
    });
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
      <Dialog
        isDialogOpen={isFolderModalOpen}
        setDialogOpen={setIsFolderModalOpen}
      >
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>

        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full p-3 rounded mb-4 bg-[#353536] hover:bg-[#2e2e2e] outline-none"
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
      </Dialog>
    </>
  );
};

export default CreateNewFolder;
