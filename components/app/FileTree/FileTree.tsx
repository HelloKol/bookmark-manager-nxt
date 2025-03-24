import { useState, useRef, useEffect } from "react";
import { File, Folder, ChevronRight } from "lucide-react";
import Link from "next/link";

type FileItem = {
  name: string;
  type: "file";
};

type FolderItem = {
  name: string;
  type: "folder";
  children: (FileItem | FolderItem)[];
};

type FileTreeItem = FileItem | FolderItem;

type FileTreeProps = {
  items: FileTreeItem[];
  className?: string;
};

export default function FileTree({ items, className = "" }: FileTreeProps) {
  return (
    <div className={`w-full max-w-md ${className}`}>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <FileTreeNode key={index} item={item} />
        ))}
      </ul>
    </div>
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
    console.log("BOOK MARK");
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
          className="relative z-10"
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
      </Link>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <ul className="border-l border-muted pl-4 ml-4 mt-1 space-y-1 py-1">
          {item?.links &&
            Object.keys(item.links as FolderItem).map((key, index) => {
              console.log({
                ...item.links[key],
                type: "bookmark",
              });

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
