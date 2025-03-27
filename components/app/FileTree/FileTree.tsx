import { useState, useRef, useEffect } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useFetchFoldersWithLinks } from "@/hooks/queries/useFetchFolders";
import { SidebarGroupLabel } from "../Sidebar/sidebar";
import CreateNewFolder from "@/components/CreateNewFolder";
import { Button } from "@/components/ui/button";

// A custom type for our tree items
interface TreeBookmark {
  id: string;
  url: string;
  requestUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  createdAt: string;
  type: "bookmark";
  [key: string]: string | number | boolean | object | undefined | null;
}

interface TreeFolder {
  id: string;
  name: string;
  slug: string;
  links: Record<string, TreeBookmark> | null;
  type: "folder";
}

type FileTreeItem = TreeFolder | TreeBookmark;

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

  // Convert folders to our tree format using type assertions
  // This is safer than trying to match exact types from external definitions
  const treeItems: FileTreeItem[] =
    folders?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (folder: any) => {
        const treeFolder: TreeFolder = {
          id: folder.id,
          name: folder.name,
          slug: folder.slug,
          links: folder.links
            ? // Convert each link to our TreeBookmark format
              Object.entries(folder.links).reduce(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (acc, [key, linkData]: [string, any]) => {
                  acc[key] = {
                    ...linkData,
                    id: key,
                    url: linkData.url || "",
                    requestUrl: linkData.requestUrl || "",
                    createdAt: linkData.createdAt || new Date().toISOString(),
                    type: "bookmark" as const,
                  };
                  return acc;
                },
                {} as Record<string, TreeBookmark>
              )
            : null,
          type: "folder" as const,
        };
        return treeFolder;
      }
    ) || [];

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
          {treeItems.map((item, index) => (
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

  // At this point TypeScript knows that item is a TreeFolder
  const hasLinks =
    item.links !== null && Object.keys(item.links || {}).length > 0;

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
          disabled={!hasLinks}
        >
          <ChevronRight
            className="h-4 w-4 text-muted-foreground transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/static/macos-folder.png"
          alt="Folder icon"
          className="block w-5 cursor-pointer"
        />
        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {item.name}
        </span>

        <p className="ml-auto text-sm text-muted-foreground">
          {item.links ? Object.keys(item.links).length : 0}
        </p>
      </Link>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <ul className="border-l border-muted pl-4 ml-4 mt-1 space-y-1 py-1">
          {item.links &&
            hasLinks &&
            Object.entries(item.links).map(([key, linkData]) => (
              <FileTreeNode key={key} item={linkData} />
            ))}
        </ul>
      </div>
    </li>
  );
}
