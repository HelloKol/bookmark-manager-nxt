import React from "react";
import CreateNewFolder from "@/components/CreateNewFolder";

export default function Home() {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Bookmarks</h1>
        <CreateNewFolder />
      </div>
    </div>
  );
}
