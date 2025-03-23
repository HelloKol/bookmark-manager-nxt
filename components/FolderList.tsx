import React from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppProvider";
import { useFetchFolders } from "@/hooks/data/useFetchFolders";
import ShareFolder from "./ShareFolder";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

export default function FolderList() {
  const { user, searchTerm, userLoading } = useAppContext();
  const state = useFetchFolders(user?.uid || null, userLoading);

  // Filter links based on searchTerm
  const filteredFolders =
    state.status === "success"
      ? state.folders.filter((folder) => {
          const searchLower = searchTerm.toLowerCase();
          return folder.name?.toLowerCase().includes(searchLower);
        })
      : [];

  if (state.status === "loading" || userLoading === "loading")
    return <p>Loading folders...</p>;
  if (state.status === "error") return <p>Error: {state.error}</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {filteredFolders.length === 0 && <p>No folders found.</p>}

      <div className="flex gap-4">
        {filteredFolders.map((folder) => (
          <div key={folder.id} className="">
            {/* Dropdown Menu */}
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ShareFolder
                    userId={user?.uid || ""}
                    folderId={folder.id}
                    folderData={folder}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>

            <Link
              href={`/folder/${folder.slug}`}
              className="block col-span-2 p-4 text-center cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/static/macos-folder.png"
                alt="Vercel Logo"
                className="block w-32 cursor-pointer"
              />
              {folder.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
