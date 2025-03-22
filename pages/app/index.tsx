import React from "react";
import Header from "@/components/Header";
import Greeting from "@/components/Greeting";
import SearchbarHeader from "@/components/SearchbarHeader";
import FolderList from "@/components/FolderList";
import { useAppContext } from "@/context/AppProvider";

export default function Home() {
  const { user } = useAppContext();

  return (
    <div className="container mx-auto p-4">
      <SearchbarHeader />
      <Greeting name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} />
      <Header />
      <FolderList user={user} />
    </div>
  );
}
