import React from "react";
import Header from "@/components/Header";
// import Greeting from "@/components/Greeting";
import SearchbarHeader from "@/components/SearchbarHeader";
import FolderList from "@/components/FolderList";
import Tags from "@/components/app/Tags";
import BookmarkList from "@/components/BookmarkList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      {/* <SearchbarHeader /> */}
      {/* <Greeting name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} /> */}
      <Header />
      <Tags />
      <FolderList />
      <BookmarkList />
    </div>
  );
}
