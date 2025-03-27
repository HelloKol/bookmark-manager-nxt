import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

interface BookmarkCreationHookResult {
  urls: string[];
  textAreaValue: string;
  tags: string[];
  handleUrlsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCreateBookmark: (
    userId: string,
    folderId: string | null
  ) => Promise<boolean>;
  isCreating: boolean;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  tagInputValue: string;
  setTagInputValue: (value: string) => void;
}

/**
 * Custom hook for handling bookmark creation functionality
 *
 * @returns An object containing state and handlers for bookmark creation
 */
export function useBookmarkCreation(): BookmarkCreationHookResult {
  const [urls, setUrls] = useState<string[]>([]);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState<string>("");

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

  // Add a tag to the list
  const addTag = (tag: string) => {
    // Skip if tag is empty or already exists
    if (!tag.trim() || tags.includes(tag.trim())) return;
    setTags([...tags, tag.trim()]);
    setTagInputValue(""); // Clear input after adding
  };

  // Remove a tag from the list
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle keydown event for tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInputValue.trim()) {
      e.preventDefault(); // Prevent form submission
      addTag(tagInputValue);
    }
  };

  // Handle bookmark creation
  const handleCreateBookmark = async (
    userId: string,
    folderId: string | null
  ): Promise<boolean> => {
    if (urls.length === 0 || !userId) return false;

    setIsCreating(true);

    // Clean URLs before submitting
    const cleanUrls = urls.map((url) => url.replace(/\/$/, ""));

    // Wrap the operation in a promise for toast handling
    const createBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          // Use the API client
          await api.saveLinks({
            urls: cleanUrls,
            userId,
            folderId,
            tags: tags.length > 0 ? tags : undefined, // Only include tags if there are any
          });

          resolve();
        } catch (error) {
          reject(error);
        } finally {
          setIsCreating(false);
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
        render: ({ data }) =>
          `Error saving bookmarks: ${
            data instanceof Error ? data.message : "Unknown error"
          }`,
      },
    });

    // Clear form on success
    const success = await createBookmarksPromise
      .then(() => true)
      .catch(() => false);

    if (success) {
      setTextAreaValue("");
      setUrls([]);
      setTags([]);
      setTagInputValue("");
    }

    return success;
  };

  return {
    urls,
    textAreaValue,
    tags,
    handleUrlsChange,
    handleCreateBookmark,
    isCreating,
    addTag,
    removeTag,
    handleTagInputKeyDown,
    tagInputValue,
    setTagInputValue,
  };
}
