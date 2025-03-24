import React from "react";
import Header from "@/components/Header";
import FolderList from "@/components/FolderList";
import Tags from "@/components/app/Tags";
import BookmarkList from "@/components/BookmarkList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <Tags />
      <FolderList />
      <BookmarkList />
    </div>
  );
}
