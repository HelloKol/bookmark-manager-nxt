import React from "react";
import CreateNewFolder from "@/components/CreateNewFolder";

interface Props {}

export default function Home({}: Props) {
  return (
    <div className="flex gap-4 justify-between items-center mb-4">
      <h2 className="col-span-full text-lg font-bold">
        All bookmarks{" "}
        {/* <span className="text-zinc-500">{filteredLinks.length}</span> */}
      </h2>
      <div className="flex gap-4">
        <CreateNewFolder />
      </div>
    </div>
  );
}
