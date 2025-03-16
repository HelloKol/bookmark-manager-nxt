import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import BookmarkPreviewBasic from "@/components/BookmarkPreviews/BookmarkPreviewBasic";
import BookmarkPreviewCompact from "@/components/BookmarkPreviews/BookmarkPreviewCompact";
import BookmarkPreviewDetailed from "@/components/BookmarkPreviews/BookmarkPreviewDetailed";
import PreviewCardToggle from "@/components/PreviewCardToggle";
import { db } from "@/lib/firebase";
import ViewBasic from "@/components/svg/ViewBasic";
import ViewCompact from "@/components/svg/ViewCompact";
import ViewDetailed from "@/components/svg/ViewDetailed";
import CreateNewBookmark from "@/components/CreateNewBookmark";
import { useAppContext } from "@/context/AppProvider";

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
  setLoading: (loading: boolean) => void;
}

export default function Home({ user, setLoading }: Props) {
  const { searchTerm } = useAppContext();
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

  // Filter savedLinks based on searchTerm
  const filteredLinks =
    savedLinks.length > 0
      ? savedLinks.filter((link) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            link.ogTitle?.toLowerCase().includes(searchLower) ||
            link.ogDescription?.toLowerCase().includes(searchLower) ||
            link.requestUrl.toLowerCase().includes(searchLower)
          );
        })
      : [];

  const tabs = [
    {
      value: "tab1",
      label: "basic",
      icon: <ViewBasic className="w-10 h-10" />,
      content: (
        <>
          {/* Render saved links from the database */}
          {filteredLinks.length > 0 && (
            <div className="saved-links">
              {filteredLinks.map((link, index) => (
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
          {filteredLinks.length > 0 && (
            <div className="saved-links">
              {filteredLinks.map((link, index) => (
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
          {filteredLinks.length > 0 && (
            <div className="saved-links grid grid-cols-12 gap-4">
              {filteredLinks.map((link, index) => (
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
      <div className="flex gap-4 justify-between items-center mb-4">
        <h2 className="col-span-full text-lg font-bold">
          All bookmarks{" "}
          <span className="text-zinc-500">{filteredLinks.length}</span>
        </h2>
        <CreateNewBookmark setLoading={setLoading} />
      </div>
      <PreviewCardToggle tabs={tabs} ariaLabel="Manage your account" />
    </div>
  );
}
