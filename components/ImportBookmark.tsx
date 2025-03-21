import type React from "react";
import { useRef } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";

interface HtmlImportButtonProps {
  folderId: string;
}

export default function HtmlImportButton({ folderId }: HtmlImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateBookmark = async (urls: string[]) => {
    if (urls.length === 0) return;

    const user = auth.currentUser;
    if (!user) return alert("Not authenticated");

    // Wrap the entire operation in a promise
    const createBookmarksPromise = new Promise<void>(
      async (resolve, reject) => {
        try {
          // Map through URLs and save them
          const savePromises = urls.map(async (url) => {
            const cleanUrl = url.replace(/\/$/, "");

            const res = await fetch("/api/saveLinks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: cleanUrl,
                userId: user.uid,
                folderId,
              }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Failed to save link");
            }
          });

          // Wait for all promises to resolve
          await Promise.all(savePromises);

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );

    // Use toast.promise to handle loading, success, and error states
    toast.promise(createBookmarksPromise, {
      pending: "Saving bookmarks...",
      success: {
        render: "Bookmarks saved successfully!",
      },
      error: {
        render: "Error saving bookmarks",
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check if file is HTML
    if (!file.name.endsWith(".html") && !file.type.includes("html")) {
      alert("Please select an HTML file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const links = doc.querySelectorAll("a");
      const parsedBookmarks = Array.from(links).map(
        (link) => link.getAttribute("href") || "#"
      );
      handleCreateBookmark(parsedBookmarks);
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
      <button onClick={handleButtonClick} className="flex items-center gap-2">
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
        Import
      </button>
    </div>
  );
}
