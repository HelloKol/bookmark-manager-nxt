import React from "react";
import { useAppContext } from "@/context/AppProvider";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./app/Sidebar/separator";
import BookmarkPreviewDetailed from "./BookmarkPreviews/BookmarkPreviewDetailed";
import { useBookmarkCreation } from "@/hooks/useBookmarkCreation";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function BookmarkList({
  bookmarks = [],
  isLoading,
  error,
}: BookmarkListProps) {
  const { searchTerm, user } = useAppContext();

  // Use the custom hook for bookmark creation
  const { textAreaValue, handleUrlsChange, handleCreateBookmark, isCreating } =
    useBookmarkCreation();

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
            disabled={!textAreaValue || isCreating}
            onClick={() => handleCreateBookmark(user?.uid ?? "", null)}
          >
            {isCreating ? "Creating..." : "Create"}
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
