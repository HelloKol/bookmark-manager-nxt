import React, { useState, useEffect } from "react";
import { ref, onValue, remove, set, push } from "firebase/database";
import BookmarkPreviewBasic from "@/components/BookmarkPreviews/BookmarkPreviewBasic";
import BookmarkPreviewCompact from "@/components/BookmarkPreviews/BookmarkPreviewCompact";
import BookmarkPreviewDetailed from "@/components/BookmarkPreviews/BookmarkPreviewDetailed";
import PreviewCardToggle from "@/components/PreviewCardToggle";
import { db } from "@/lib/firebase";
import ViewBasic from "@/components/svg/ViewBasic";
import ViewCompact from "@/components/svg/ViewCompact";
import ViewDetailed from "@/components/svg/ViewDetailed";
import { useAppContext } from "@/context/AppProvider";
import { toast } from "react-toastify";

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

interface Folder {
  id: string;
  name: string;
}

interface Props {
  user: User | null;
  folderId: string;
}

const modernMacOSTagColors = [
  "#FF665E", // Red
  "#FFA000", // Orange
  "#FFE000", // Yellow
  "#00F449", // Green
  "#00AFFF", // Blue
  "#FF7FFF", // Purple
  "#ACA8AC", // Gray
];

const getRandomModernMacOSTagColor = () => {
  return modernMacOSTagColors[
    Math.floor(Math.random() * modernMacOSTagColors.length)
  ];
};

export default function Bookmarks({ user, folderId }: Props) {
  const { searchTerm } = useAppContext();
  const [links, setLinks] = useState<Preview[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!user || !folderId) return;

    const folderRef = ref(db, `users/${user.uid}/folders/${folderId}`);

    const unsubscribe = onValue(folderRef, (snapshot) => {
      if (snapshot.exists()) {
        const folderData = snapshot.val();

        const linksObj = folderData.links || {};
        const linksArray: Preview[] = Object.values(linksObj);

        setLinks(linksArray);
      } else {
        setLinks([]);
      }
    });

    return () => unsubscribe();
  }, [user, folderId]);

  // Fetch all folders (to pass them into BookmarkPreviewBasic)
  useEffect(() => {
    if (!user) return;

    const foldersRef = ref(db, `users/${user.uid}/folders`);

    const unsubscribe = onValue(foldersRef, (snapshot) => {
      if (snapshot.exists()) {
        const foldersData = snapshot.val();

        const foldersArray: Folder[] = Object.keys(foldersData).map((id) => ({
          id,
          ...foldersData[id],
        }));

        setFolders(foldersArray);
      } else {
        setFolders([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Delete link from current folder
  const handleDelete = async (linkRequestUrl: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a link");
      return;
    }

    // Wrap the deletion logic in a promise
    const updateBookmark = new Promise<void>(async (resolve, reject) => {
      try {
        const folderRef = ref(
          db,
          `users/${user.uid}/folders/${folderId}/links`
        );
        const snapshot = await onValueOnce(folderRef);

        if (!snapshot.exists()) {
          reject(new Error("No links found"));
          return;
        }

        const linksObj = snapshot.val();
        const linkId = Object.keys(linksObj).find(
          (key) => linksObj[key].requestUrl === linkRequestUrl
        );

        if (!linkId) {
          reject(new Error("Link not found"));
          return;
        }

        await remove(
          ref(db, `users/${user.uid}/folders/${folderId}/links/${linkId}`)
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // Use toast.promise to handle loading, success, and error states
    toast.promise(updateBookmark, {
      pending: "Deleting link...",
      success: "Link deleted successfully!",
      error: {
        render: ({ data }) => {
          if (data instanceof Error) {
            return data.message || "Error deleting link";
          }
          return "Error deleting link";
        },
      },
    });
  };

  // Edit link: move to another folder and/or update requestUrl
  const handleEdit = async (
    oldLink: Preview,
    newRequestUrl: string,
    newFolderId: string,
    newTags: string[] // Array of tag names
  ) => {
    if (!user) {
      toast.error("You must be logged in to edit a link");
      return;
    }

    const updateBookmark = new Promise<void>(async (resolve, reject) => {
      try {
        const folderRef = ref(
          db,
          `users/${user.uid}/folders/${folderId}/links`
        );
        const snapshot = await onValueOnce(folderRef);
        if (!snapshot.exists()) return;

        const linksObj = snapshot.val();
        const linkId = Object.keys(linksObj).find(
          (key) => linksObj[key].requestUrl === oldLink.requestUrl
        );

        if (!linkId) return;

        // Step 1: Update the link's URL and folder
        if (folderId !== newFolderId) {
          // Move link to a different folder
          await remove(
            ref(db, `users/${user.uid}/folders/${folderId}/links/${linkId}`)
          );

          const response = await fetch("/api/saveLinks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.uid,
              folderId: newFolderId,
              url: newRequestUrl,
            }),
          });

          if (!response.ok) {
            reject(new Error("Failed to move and save link"));
          }
        } else {
          // Update link in the same folder
          const response = await fetch("/api/updateLink", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.uid,
              folderId,
              linkId,
              requestUrl: newRequestUrl,
            }),
          });

          if (!response.ok) {
            reject(new Error("Failed to update link"));
          }
        }

        // Step 2: Update tags
        const tagsRef = ref(db, `tags`);
        const tagsSnapshot = await onValueOnce(tagsRef);
        const existingTags = tagsSnapshot.exists() ? tagsSnapshot.val() : {};

        const updatedTags: Record<string, boolean> = {};

        for (const tagName of newTags) {
          const tagId = Object.keys(existingTags).find(
            (key) => existingTags[key].name === tagName
          );

          if (tagId) {
            // Tag already exists, reuse it
            updatedTags[tagId] = true;
          } else {
            const tagColor = getRandomModernMacOSTagColor();

            // Create a new tag
            const newTagId = push(ref(db, "tags")).key;
            await set(ref(db, `tags/${newTagId}`), {
              name: tagName,
              links: { [linkId]: true },
              folders: { [newFolderId]: true },
              tagColor: tagColor,
            });
            updatedTags[newTagId] = true;
          }
        }

        // Update the link's tags
        await set(
          ref(
            db,
            `users/${user.uid}/folders/${newFolderId}/links/${linkId}/tags`
          ),
          updatedTags
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(updateBookmark, {
      pending: "Updating link...",
      success: "Link updated successfully!",
      error: {
        render: ({ data }) => {
          if (data instanceof Error) {
            return data.message || "Error updating link";
          }
          return "Error updating link";
        },
      },
    });
  };

  // Filter links based on searchTerm
  const filteredLinks = searchTerm
    ? links.filter((link) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          link.ogTitle?.toLowerCase().includes(searchLower) ||
          link.ogDescription?.toLowerCase().includes(searchLower) ||
          link.requestUrl.toLowerCase().includes(searchLower)
        );
      })
    : links;

  const tabs = [
    {
      value: "tab1",
      label: "Basic",
      icon: <ViewBasic className="w-10 h-10" />,
      content: (
        <>
          {filteredLinks.length > 0 ? (
            <div className="saved-links">
              {filteredLinks.map((link, index) => (
                <BookmarkPreviewBasic
                  key={index}
                  preview={link}
                  currentFolderId={folderId}
                  folders={folders}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <p>No links in this folder</p>
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
          {filteredLinks.length > 0 ? (
            <div className="saved-links">
              {filteredLinks.map((link, index) => (
                <BookmarkPreviewCompact key={index} preview={link} />
              ))}
            </div>
          ) : (
            <p>No links in this folder</p>
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
          {filteredLinks.length > 0 ? (
            <div className="saved-links grid grid-cols-12 gap-4">
              {filteredLinks.map((link, index) => (
                <BookmarkPreviewDetailed key={index} preview={link} />
              ))}
            </div>
          ) : (
            <p>No links in this folder</p>
          )}
        </>
      ),
    },
  ];

  return <PreviewCardToggle tabs={tabs} ariaLabel="View bookmarks" />;
}

// Firebase helper to get snapshot once
async function onValueOnce(refObj: ReturnType<typeof ref>) {
  return new Promise<any>((resolve, reject) => {
    onValue(
      refObj,
      (snapshot) => {
        resolve(snapshot);
      },
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}
