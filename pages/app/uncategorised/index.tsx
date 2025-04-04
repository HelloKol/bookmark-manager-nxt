import React from "react";
import Header from "@/components/Header";
import BookmarkList from "@/components/BookmarkList";
import { useFetchUncategorisedBookmarks } from "@/hooks/queries/useFetchUncategorisedBookmarks";

export default function UncategorisedBookmarks() {
  const {
    data: bookmarks,
    isPending,
    error,
  } = useFetchUncategorisedBookmarks();
  const bookmarkLength = bookmarks?.length || 0;

  return (
    <div className="container mx-auto p-4">
      <Header bookmarkLength={bookmarkLength} />
      <BookmarkList
        bookmarks={bookmarks || []}
        isLoading={isPending}
        error={error}
      />
    </div>
  );
}
