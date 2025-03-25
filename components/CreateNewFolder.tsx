import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateSlug } from "@/lib/utils";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";

interface Props {
  isFolderModalOpen: boolean;
  setIsFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateNewFolder: React.FC<Props> = ({
  isFolderModalOpen,
  setIsFolderModalOpen,
}) => {
  const [folderName, setFolderName] = useState("");
  // const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

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
        // Generate a unique ID for the folder
        const folderId =
          Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

        // Get the folders document
        const foldersDocRef = doc(db, "users", user.uid, "data", "folders");
        const foldersDoc = await getDoc(foldersDocRef);

        // Check if folders document exists and get its data
        const foldersData = foldersDoc.exists() ? foldersDoc.data() : {};

        // Create new folder data
        const newFolderData = {
          name: folderName.trim(),
          slug,
          createdAt: new Date().toISOString(),
          links: {},
        };

        // Add the new folder to the existing folders data
        const updatedFoldersData = {
          ...foldersData,
          [folderId]: newFolderData,
        };

        // Save the updated folders document
        await setDoc(foldersDocRef, updatedFoldersData);

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
    <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
      {/* <DialogTrigger asChild>
        <Button type="button" onClick={() => setIsFolderModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger> */}

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFolderModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreateFolder}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewFolder;
