import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { generateSlug } from "@/lib/utils";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";

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
    <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => setIsFolderModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>

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
