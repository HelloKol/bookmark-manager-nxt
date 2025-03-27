import { useState, useRef, useEffect } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Folder } from "@/types";
import { useFetchFoldersWithLinks } from "@/hooks/data/useFetchFolders";
import { SidebarGroupLabel } from "../Sidebar/sidebar";
import CreateNewFolder from "@/components/CreateNewFolder";
import { Button } from "@/components/ui/button";

type FolderItem = Folder;

type FileTreeItem = FolderItem;

type FileTreeProps = {
  className?: string;
};

export default function FileTree({ className = "" }: FileTreeProps) {
  const { data: folders, isPending, error } = useFetchFoldersWithLinks();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  if (isPending) {
    return (
      <SidebarGroupLabel className="block mt-4">
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="h-8 bg-gray-200 rounded mb-4 animate-pulse w-full"
          ></div>
        ))}
      </SidebarGroupLabel>
    );
  }

  if (error) {
    return (
      <SidebarGroupLabel className="flex justify-between">
        <p className="text-base">Error loading folders</p>
      </SidebarGroupLabel>
    );
  }

  return (
    <>
      <SidebarGroupLabel className="flex justify-between">
        <p className="text-base">{folders?.length} Collections</p>
        <Button variant={"ghost"} onClick={() => setIsFolderModalOpen(true)}>
          <Plus className="h-6 w-6" />
        </Button>
        <CreateNewFolder
          isFolderModalOpen={isFolderModalOpen}
          setIsFolderModalOpen={setIsFolderModalOpen}
        />
      </SidebarGroupLabel>
      <div className={`w-full max-w-md ${className}`}>
        <ul className="space-y-1">
          {folders &&
            folders.map((item, index) => (
              <FileTreeNode key={index} item={item} />
            ))}
        </ul>
      </div>
    </>
  );
}

type FileTreeNodeProps = {
  item: FileTreeItem;
};

function FileTreeNode({ item }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? scrollHeight : 0);
    }
  }, [isOpen]);

  if (item.type === "bookmark") {
    return (
      <Link
        href={item.requestUrl}
        target="_blank"
        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50"
      >
        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {item.ogTitle || item.requestUrl}
        </span>
      </Link>
    );
  }

  return (
    <li>
      <Link
        href={`/folder/${item.slug}`}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item?.links && Object.keys(item?.links).length === 0}
        >
          <ChevronRight
            className="h-4 w-4 text-muted-foreground transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/static/macos-folder.png"
          alt="Vercel Logo"
          className="block w-5 cursor-pointer"
        />
        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {item.name}
        </span>

        <p className="ml-auto text-sm text-muted-foreground">
          {item?.links && Object.keys(item?.links).length}
        </p>
      </Link>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <ul className="border-l border-muted pl-4 ml-4 mt-1 space-y-1 py-1">
          {item?.links &&
            Object.keys(item.links).map((key, index) => {
              return (
                <FileTreeNode
                  key={index}
                  item={{
                    ...item.links[key],
                    type: "bookmark",
                  }}
                />
              );
            })}
        </ul>
      </div>
    </li>
  );
}
