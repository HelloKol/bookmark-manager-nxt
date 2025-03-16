import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { auth } from "@/lib/firebase";

interface CreateNewBookmarkProps {
  setLoading: (loading: boolean) => void;
}

const CreateNewBookmark: React.FC<CreateNewBookmarkProps> = ({
  setLoading,
}) => {
  const [urls, setUrls] = useState<string[]>([]); // State to store array of URLs
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleFetchMetadata = async () => {
    if (urls.length === 0) return;

    const user = auth.currentUser;
    if (!user) return alert("Not authenticated");

    setLoading(true);
    // setPreviews([]); // Clear previous previews

    try {
      urls.map(async (url) => {
        // Remove trailing slash from the URL if it exists
        const cleanUrl = url.replace(/\/$/, "");

        const res = await fetch("/api/saveLinks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: cleanUrl, userId: user.uid }), // Send the cleaned URL
        });

        const data = await res.json();
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.error);
        }
      });

      // Wait for all metadata to be fetched
      // const metadata = await Promise.all(metadataPromises);
      // setPreviews(metadata); // Set the fetched metadata for all links
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in textarea (split URLs by newline)
  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);

    const urlsArray = value
      .split("\n") // Split by new lines
      .map((url) => url.trim())
      .filter((url) => url); // Filter out empty URLs
    setUrls(urlsArray);
  };

  // Handle keydown event to detect Enter or Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // If Shift is not held, we prevent the default action to avoid new line and fetch metadata
      if (!e.shiftKey) {
        e.preventDefault();
        handleFetchMetadata();
      }
    }
  };

  return (
    <>
      <button
        className="rounded-md cursor-pointer bg-orange-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        type="button"
        onClick={() => setIsSearchModalOpen(true)}
      >
        Create new bookmark
      </button>

      {/* Create Modal */}
      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Content className="fixed inset-0 w-screen h-screen">
            <textarea
              value={textAreaValue} // Use the local state for textarea value
              onChange={handleUrlsChange}
              onKeyDown={handleKeyDown} // Add keydown event handler
              placeholder="Paste URLs here, one per line"
              className="w-full h-full p-5 bg-[#242424] focus:outline-none"
            />

            <button
              className="fixed top-5 right-5 z-1 bg-amber-600 p-4 cursor-pointer"
              onClick={() => setIsSearchModalOpen(false)}
            >
              Close
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default CreateNewBookmark;
