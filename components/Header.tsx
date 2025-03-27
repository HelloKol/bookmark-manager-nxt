import React from "react";
import CreateNewBookmark from "./CreateNewBookmark";
import { useFetchFoldersList } from "@/hooks/queries/useFetchFolders";

export default function Header({ bookmarkLength }: { bookmarkLength: number }) {
  // Use the basic folders list hook since we don't need links
  const { data: folders = [], error } = useFetchFoldersList();

  // Check both isPending and isLoading to handle initial load and enabled state changes
  if (error) return <div>Error loading folders</div>;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          My Bookmarks ({bookmarkLength})
        </h1>
        <div>
          <CreateNewBookmark folders={folders} />
        </div>
      </div>
    </div>
  );
}
