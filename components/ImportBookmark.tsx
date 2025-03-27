import type React from "react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useAppContext } from "@/context/AppProvider";

interface HtmlImportButtonProps {
  folderId: string;
}

export default function HtmlImportButton({ folderId }: HtmlImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportBookmarks = async (urls: string[]) => {
    if (urls.length === 0) return;
    if (!user) return;

    setIsImporting(true);

    // Clean URLs before submitting
    const cleanUrls = urls.map((url) => url.replace(/\/$/, ""));

    // Wrap the entire operation in a promise for toast handling
    const importBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          // Use our API client instead of direct fetch
          await api.saveLinks({
            urls: cleanUrls,
            userId: user.uid,
            folderId: folderId || null,
          });

          resolve();
        } catch (error) {
          reject(error);
        } finally {
          setIsImporting(false);
        }
      }
    );

    // Use toast.promise to handle loading, success, and error states
    toast.promise(importBookmarksPromise, {
      pending: `Importing ${urls.length} bookmarks...`,
      success: {
        render: `Successfully imported ${urls.length} bookmarks!`,
      },
      error: {
        render: ({ data }) =>
          `Error importing bookmarks: ${
            data instanceof Error ? data.message : "Unknown error"
          }`,
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check if file is HTML
    if (!file.name.endsWith(".html") && !file.type.includes("html")) {
      toast.error("Please select an HTML file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const links = doc.querySelectorAll("a");
      const parsedBookmarks = Array.from(links)
        .map((link) => link.getAttribute("href") || "")
        .filter((url) => url && !url.startsWith("#")); // Filter out empty links and anchors

      handleImportBookmarks(parsedBookmarks);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".html"
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="flex items-center gap-2"
        disabled={isImporting}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-upload"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {isImporting ? "Importing..." : "Import"}
      </button>
    </div>
  );
}
