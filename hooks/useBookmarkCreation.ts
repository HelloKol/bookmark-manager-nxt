import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

interface BookmarkCreationHookResult {
  urls: string[];
  textAreaValue: string;
  handleUrlsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCreateBookmark: (
    userId: string,
    folderId: string | null
  ) => Promise<boolean>;
  isCreating: boolean;
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
    }

    return success;
  };

  return {
    urls,
    textAreaValue,
    handleUrlsChange,
    handleCreateBookmark,
    isCreating,
  };
}
