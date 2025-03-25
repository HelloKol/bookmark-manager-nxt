import React from "react";
import Header from "@/components/Header";
import BookmarkList from "@/components/BookmarkList";
import { useFetchAllBookmarks } from "@/hooks/data/useFetchAllBookmarks";

export default function AllBookmarks() {
  const { data: bookmarks, isLoading, error } = useFetchAllBookmarks();
  const bookmarkLength = bookmarks?.length || 0;

  return (
    <div className="container mx-auto p-4">
      <Header bookmarkLength={bookmarkLength} />
      <BookmarkList
        bookmarks={bookmarks || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
