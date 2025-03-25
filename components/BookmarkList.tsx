import React, { useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./app/Sidebar/separator";
import BookmarkPreviewDetailed from "./BookmarkPreviews/BookmarkPreviewDetailed";
import { Bookmark } from "@/types";

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
  const { searchTerm } = useAppContext();
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  // Handle change in textarea (split URLs by newline)
  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);
  };

  // Handle keydown event to detect Enter or Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // If Shift is not held, we prevent the default action to avoid new line and fetch metadata
      e.preventDefault();
      // handleCreateBookmark();
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

  if (isLoading) return <p>Loading bookmarks...</p>;
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
            onKeyDown={handleKeyDown}
            placeholder="Paste URLs here, one per line"
            variant="large"
          />
          <Button
            type="button"
            className="w-full mt-2"
            disabled={!textAreaValue}
          >
            Create
          </Button>
        </div>

        {filteredBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="col-span-13 lg:col-span-6 xl:col-span-4 mb-5 lg:mb-8"
          >
            <BookmarkPreviewDetailed
              preview={{
                ...bookmark,
                requestUrl: bookmark.url,
                ogUrl: bookmark.url,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
