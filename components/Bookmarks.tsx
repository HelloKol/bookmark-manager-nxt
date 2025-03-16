import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import BookmarkPreviewBasic from "@/components/BookmarkPreviews/BookmarkPreviewBasic";
import BookmarkPreviewCompact from "@/components/BookmarkPreviews/BookmarkPreviewCompact";
import BookmarkPreviewDetailed from "@/components/BookmarkPreviews/BookmarkPreviewDetailed";
import PreviewCardToggle from "@/components/PreviewCardToggle";
import { auth, db } from "@/lib/firebase";
import ViewBasic from "@/components/svg/ViewBasic";
import ViewCompact from "@/components/svg/ViewCompact";
import ViewDetailed from "@/components/svg/ViewDetailed";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
}

interface Props {
  user: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function Home({ user, loading, setLoading }: Props) {
  const [urls, setUrls] = useState<string[]>([]); // State to store array of URLs
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [savedLinks, setSavedLinks] = useState<Preview[]>([]); // State to store saved links

  useEffect(() => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/links`);

    // Subscribe to real-time updates
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const links = Object.values(snapshot.val()) as Preview[];
        setSavedLinks(links);
      } else {
        setSavedLinks([]); // Clear saved links if the snapshot is empty
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]); // Re-run effect if the user changes

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

  const tabs = [
    {
      value: "tab1",
      label: "basic",
      icon: <ViewBasic className="w-10 h-10" />,
      content: (
        <>
          {/* Render saved links from the database */}
          {savedLinks.length > 0 && (
            <div className="saved-links">
              {savedLinks.map((link, index) => (
                <BookmarkPreviewBasic key={index} preview={link} />
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      value: "tab2",
      label: "Compact",
      icon: <ViewCompact className="w-10 h-10" />,
      content: (
        <>
          {/* Render saved links from the database */}
          {savedLinks.length > 0 && (
            <div className="saved-links">
              {savedLinks.map((link, index) => (
                <BookmarkPreviewCompact key={index} preview={link} />
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      value: "tab3",
      label: "Detailed",
      icon: <ViewDetailed className="w-10 h-10" />,
      content: (
        <>
          {/* Render saved links from the database */}
          {savedLinks.length > 0 && (
            <div className="saved-links grid grid-cols-12 gap-4">
              {savedLinks.map((link, index) => (
                <BookmarkPreviewDetailed key={index} preview={link} />
              ))}
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <textarea
          value={textAreaValue} // Use the local state for textarea value
          onChange={handleUrlsChange}
          onKeyDown={handleKeyDown} // Add keydown event handler
          placeholder="Paste URLs here, one per line"
          className="border border-gray-300 rounded-md bg-zinc-900"
          rows={10}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        />
        <button onClick={handleFetchMetadata} disabled={loading}>
          {loading ? "Loading..." : "Fetch Previews"}
        </button>
      </div>

      <div className="flex gap-4 justify-between items-center">
        <h2 className="col-span-full">All bookmarks</h2>
        <button
          className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
        >
          Create new bookmark
        </button>
      </div>

      <PreviewCardToggle tabs={tabs} ariaLabel="Manage your account" />
    </div>
  );
}
