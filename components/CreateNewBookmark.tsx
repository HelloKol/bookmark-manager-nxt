import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { useAppContext } from "@/context/AppProvider";
import { useBookmarkCreation } from "@/hooks/useBookmarkCreation";

interface FolderType {
  id: string;
  name: string;
  slug: string;
}

interface CreateNewBookmarkProps {
  folderId?: string; // Make folderId optional
  folders: FolderType[] | null;
}

const CreateNewBookmark: React.FC<CreateNewBookmarkProps> = ({
  folderId,
  folders,
}) => {
  const { user } = useAppContext();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Use the custom hook for bookmark creation
  const { textAreaValue, handleUrlsChange, handleCreateBookmark, isCreating } =
    useBookmarkCreation();

  const handleCloseModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsSearchModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Bookmark
      </Button>

      {/* Create Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new bookmarks</DialogTitle>
          </DialogHeader>

          <Textarea
            value={textAreaValue}
            onChange={handleUrlsChange}
            placeholder="Paste URLs here, one per line"
          />

          <div className="flex flex-col space-y-1">
            <label htmlFor="tags" className="text-sm">
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., work, entertainment"
              // onChange={(e) =>
              //   setTags(e.target.value.split(",").map((tag) => tag.trim()))
              // }
            />
          </div>

          {/* Folder Select */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="folderId" className="text-sm">
              Folder
            </label>
            {folders && (
              <select
                id="folderId"
                // {...register("folderId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a folder (optional)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isCreating}
              onClick={() => {
                handleCreateBookmark(user?.uid ?? "", folderId || null);
                handleCloseModal();
              }}
            >
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewBookmark;
