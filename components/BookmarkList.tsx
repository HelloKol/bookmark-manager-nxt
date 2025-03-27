import React, { useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./app/Sidebar/separator";
import BookmarkPreviewDetailed from "./BookmarkPreviews/BookmarkPreviewDetailed";
import { Bookmark } from "@/types";
import { toast } from "react-toastify";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: Error | null;
}

export default function BookmarkList({
  bookmarks = [],
  isLoading,
  error,
}: BookmarkListProps) {
  const { searchTerm, user } = useAppContext();
  const [urls, setUrls] = useState<string[]>([]);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

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

  const handleCreateBookmark = async () => {
    if (urls.length === 0) return;
    if (!user) return;

    // Wrap the entire operation in a promise
    const createBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          // Instead of multiple API calls, send all URLs in a single request
          const cleanUrls = urls.map((url) => url.replace(/\/$/, ""));

          console.log("Saving URLs:", cleanUrls);

          const res = await fetch("/api/saveLinks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              urls: cleanUrls, // Send array of URLs instead of single URL
              userId: user.uid,
              folderId: null, // Pass null if folderId is not provided
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to save links");
          }

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
        render: ({ data }) =>
          `Error saving bookmarks: ${
            data instanceof Error ? data.message : "Unknown error"
          }`,
      },
    });

    // Clear textarea after submission
    if (await createBookmarksPromise.then(() => true).catch(() => false)) {
      setTextAreaValue("");
      setUrls([]);
    }
  };

  // Filter links based on searchTerm
  const filteredBookmarks = bookmarks?.filter((bookmark) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      bookmark.title?.toLowerCase().includes(searchLower) ||
      bookmark.url?.toLowerCase().includes(searchLower)
    );
  });

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-13 lg:col-span-6 xl:col-span-4 p-3 bg-sidebar rounded-md flex flex-col">
          <p>New Bookmark</p>
          <Separator orientation="horizontal" className="mr-2 h-4" />
          <Textarea
            value={textAreaValue}
            onChange={handleUrlsChange}
            placeholder="Paste URLs here, one per line"
            variant="large"
          />
          <Button
            type="button"
            className="w-full mt-2"
            disabled={!textAreaValue}
            onClick={handleCreateBookmark}
          >
            Create
          </Button>
        </div>

        {isLoading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="col-span-13 lg:col-span-6 xl:col-span-4 mb-5 lg:mb-8 bg-gray-200 rounded animate-pulse w-full h-full min-h-[300px]"
              ></div>
            ))}
          </>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="col-span-13 lg:col-span-6 xl:col-span-4 mb-5 lg:mb-8 rounded overflow-hidden"
            >
              <BookmarkPreviewDetailed
                preview={{
                  ...bookmark,
                  requestUrl: bookmark.url,
                  ogUrl: bookmark.url,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
