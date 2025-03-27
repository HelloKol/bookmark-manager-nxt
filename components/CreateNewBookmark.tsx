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
import { TagList } from "./ui/Tag";

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
  const [selectedFolder, setSelectedFolder] = useState<string | null>(
    folderId || null
  );

  // Use the custom hook for bookmark creation
  const {
    textAreaValue,
    handleUrlsChange,
    handleCreateBookmark,
    isCreating,
    tags,
    addTag,
    removeTag,
    handleTagInputKeyDown,
    tagInputValue,
    setTagInputValue,
  } = useBookmarkCreation();

  const handleCloseModal = () => {
    setIsSearchModalOpen(false);
    setSelectedFolder(folderId || null);
  };

  const handleSubmit = () => {
    if (user) {
      handleCreateBookmark(user.uid, selectedFolder);
      handleCloseModal();
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setIsSearchModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Bookmark
      </Button>

      {/* Create Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new bookmarks</DialogTitle>
          </DialogHeader>

          <Textarea
            value={textAreaValue}
            onChange={handleUrlsChange}
            placeholder="Paste URLs here, one per line"
          />

          {/* Tags Input */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  type="text"
                  placeholder="Type a tag and press Enter"
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
                <Button
                  type="button"
                  onClick={() => addTag(tagInputValue)}
                  disabled={!tagInputValue.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </div>

              {/* Display added tags */}
              <TagList tags={tags} onRemove={removeTag} className="mt-2" />
            </div>
          </div>

          {/* Folder Select */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="folderId" className="text-sm font-medium">
              Folder
            </label>
            {folders && (
              <select
                id="folderId"
                value={selectedFolder || ""}
                onChange={(e) => setSelectedFolder(e.target.value || null)}
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
              disabled={isCreating || !textAreaValue.trim()}
              onClick={handleSubmit}
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
