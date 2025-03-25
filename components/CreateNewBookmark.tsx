import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
// import TagSelectorDefault from "./app/TagSelector";

interface CreateNewBookmarkProps {
  folderId?: string; // Make folderId optional
  folders: any;
}

const CreateNewBookmark: React.FC<CreateNewBookmarkProps> = ({
  folderId,
  folders,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleCloseModal = () => {
    setUrls([]);
    setTextAreaValue("");
    setIsSearchModalOpen(false);
  };

  const handleCreateBookmark = async () => {
    if (urls.length === 0) return;

    const user = auth.currentUser;
    if (!user) return alert("Not authenticated");

    // Wrap the entire operation in a promise
    const createBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          // Map through URLs and save them
          const savePromises = urls.map(async (url) => {
            const cleanUrl = url.replace(/\/$/, "");

            const res = await fetch("/api/saveLinks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: cleanUrl,
                userId: user.uid,
                folderId: folderId || null, // Pass null if folderId is not provided
              }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Failed to save link");
            }
          });

          // Wait for all promises to resolve
          await Promise.all(savePromises);

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );

    // Use toast.promise to handle loading, success, and error states
    toast.promise(createBookmarksPromise, {
      pending: "Saving bookmarks...",
      success: {
        render: "Bookmarks saved successfully!",
      },
      error: {
        render: "Error saving bookmarks",
      },
    });
  };

  // Handle change in textarea (split URLs by newline)
  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);

    const urlsArray = value
      .split("\n") // Split by new lines
      .map((url) => url.trim())
      .filter((url) => url); // Filter out empty URLs
    setUrls(urlsArray);
  };

  // Handle keydown event to detect Enter or Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // If Shift is not held, we prevent the default action to avoid new line and fetch metadata
      e.preventDefault();
      handleCloseModal();
      handleCreateBookmark();
    }
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
            onKeyDown={handleKeyDown}
            placeholder="Paste URLs here, one per line"
          />

          {/* <TagSelectorDefault /> */}

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
              onClick={() => {
                handleCreateBookmark();
                handleCloseModal();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewBookmark;
