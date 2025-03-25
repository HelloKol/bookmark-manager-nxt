import React from "react";
import Header from "@/components/Header";
import BookmarkList from "@/components/BookmarkList";
import { useFetchAllBookmarks } from "@/hooks/data/useFetchAllBookmarks";

export default function AllBookmarks() {
  const { data: bookmarks, isLoading, error } = useFetchAllBookmarks();

  return (
    <div className="container mx-auto p-4">
      <Header />
      <BookmarkList
        bookmarks={bookmarks || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
