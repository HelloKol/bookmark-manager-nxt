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

interface Preview {
  requestUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string }[];
}

interface Folder {
  folderSlug: string;
  folderName: string;
  links: Preview[];
}

interface Props {
  user: User | null;
}

export default function Home({ user }: Props) {
  const { searchTerm } = useAppContext();
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!user) return;

    const foldersRef = ref(db, `users/${user.uid}/folders`);

    // Subscribe to folders and links inside them
    const unsubscribe = onValue(foldersRef, (snapshot) => {
      if (snapshot.exists()) {
        const foldersData = snapshot.val();
        const folderArray: Folder[] = Object.entries(foldersData).map(
          ([folderSlug, folderInfo]: any) => {
            const folderName = folderInfo.folderName || "Untitled Folder";
            const linksObj = folderInfo.links || {};
            const links: Preview[] = Object.values(linksObj);

            return { folderSlug, folderName, links };
          }
        );

        setFolders(folderArray);
      } else {
        setFolders([]); // Clear folders if none exist
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Filter savedLinks based on searchTerm
  const filteredFolders = folders.map((folder) => {
    const filteredLinks =
      folder.links.length > 0
        ? folder.links.filter((link) => {
            const searchLower = searchTerm.toLowerCase();
            return (
              link.ogTitle?.toLowerCase().includes(searchLower) ||
              link.ogDescription?.toLowerCase().includes(searchLower) ||
              link.requestUrl.toLowerCase().includes(searchLower)
            );
          })
        : [];

    return { ...folder, links: filteredLinks };
  });

  const tabs = [
    {
      value: "tab1",
      label: "basic",
      icon: <ViewBasic className="w-10 h-10" />,
      content: (
        <>
          {console.log(filteredFolders)}
          {/* Render saved links from the database */}
          {filteredFolders.map((folder) => (
            <div key={folder.folderSlug} className="mb-6">
              {folder.links.length > 0 ? (
                <div className="saved-links">
                  {folder.links.map((link, index) => (
                    <BookmarkPreviewBasic key={index} preview={link} />
                  ))}
                </div>
              ) : (
                <p>No links in this folder</p>
              )}
            </div>
          ))}
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
          {filteredFolders.map((folder) => (
            <div key={folder.folderSlug} className="mb-6">
              {folder.links.length > 0 ? (
                <div className="saved-links">
                  {folder.links.map((link, index) => (
                    <BookmarkPreviewCompact key={index} preview={link} />
                  ))}
                </div>
              ) : (
                <p>No links in this folder</p>
              )}
            </div>
          ))}
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
          {filteredFolders.map((folder) => (
            <div key={folder.folderSlug} className="mb-6">
              {folder.links.length > 0 ? (
                <div className="saved-links grid grid-cols-12 gap-4">
                  {folder.links.map((link, index) => (
                    <BookmarkPreviewDetailed key={index} preview={link} />
                  ))}
                </div>
              ) : (
                <p>No links in this folder</p>
              )}
            </div>
          ))}
        </>
      ),
    },
  ];

  return <PreviewCardToggle tabs={tabs} ariaLabel="Manage your account" />;
}
