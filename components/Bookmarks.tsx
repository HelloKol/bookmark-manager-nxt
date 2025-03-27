import React from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchFoldersWithLinks } from "@/hooks/data/useFetchFolders";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
  id?: string;
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
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

/**
 * Fetches links for a specific folder
 */
const fetchLinks = async (
  userId: string | undefined,
  folderId: string
): Promise<Preview[]> => {
  if (!userId || !folderId) {
    return [];
  }

  const folderDocRef = doc(db, "users", userId, "data", "folders");
  const snapshot = await getDoc(folderDocRef);

  if (!snapshot.exists()) {
    return [];
  }

  const foldersData = snapshot.data();
  const folderData = foldersData[folderId];

  if (!folderData || !folderData.links) {
    return [];
  }

  return Object.values(folderData.links);
};

export default function Bookmarks({ user, folderId }: Props) {
  const { searchTerm } = useAppContext();
  const queryClient = useQueryClient();

  // Fetch links for the current folder
  const linksQuery = useQuery({
    queryKey: ["links", user?.uid, folderId],
    queryFn: () => fetchLinks(user?.uid, folderId),
    enabled: !!user?.uid && !!folderId,
  });

  // Use the detailed folders hook since we need links data for operations
  const foldersQuery = useFetchFoldersWithLinks();

  // Mutation for deleting a link
  const deleteMutation = useMutation({
    mutationFn: async (linkRequestUrl: string) => {
      if (!user) {
        throw new Error("You must be logged in to delete a link");
      }

      const folderDocRef = doc(db, "users", user.uid, "data", "folders");
      const folderSnapshot = await getDoc(folderDocRef);

      if (!folderSnapshot.exists()) {
        throw new Error("No folders found");
      }

      const foldersData = folderSnapshot.data();
      const folderData = foldersData[folderId];

      if (!folderData || !folderData.links) {
        throw new Error("No links found");
      }

      const linksObj = folderData.links;
      const linkId = Object.keys(linksObj).find(
        (key) => linksObj[key].requestUrl === linkRequestUrl
      );

      if (!linkId) {
        throw new Error("Link not found");
      }

      // Create updated version of the data without the link
      const updatedLinks = { ...folderData.links };
      delete updatedLinks[linkId];

      // Update the entire folder document with the modified links
      const updatedFolderData = {
        ...foldersData,
        [folderId]: {
          ...folderData,
          links: updatedLinks,
        },
      };

      await setDoc(folderDocRef, updatedFolderData);
    },
    onSuccess: () => {
      toast.success("Link deleted successfully!");
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["links", user?.uid, folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["foldersList", user?.uid] });
      queryClient.invalidateQueries({
        queryKey: ["foldersWithLinks", user?.uid],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error deleting link"
      );
    },
  });

  // Mutation for editing a link
  const editMutation = useMutation({
    mutationFn: async ({
      oldLink,
      newRequestUrl,
      newFolderId,
      newTags = [],
    }: {
      oldLink: Preview;
      newRequestUrl: string;
      newFolderId: string;
      newTags?: string[];
    }) => {
      if (!user) {
        throw new Error("You must be logged in to edit a link");
      }

      const foldersDocRef = doc(db, "users", user.uid, "data", "folders");
      const foldersSnapshot = await getDoc(foldersDocRef);

      if (!foldersSnapshot.exists()) {
        throw new Error("No folders found");
      }

      const foldersData = foldersSnapshot.data();
      const folderData = foldersData[folderId];

      if (!folderData || !folderData.links) {
        throw new Error("No links found");
      }

      const linksObj = folderData.links;
      const linkId = Object.keys(linksObj).find(
        (key) => linksObj[key].requestUrl === oldLink.requestUrl
      );

      if (!linkId) {
        throw new Error("Link not found");
      }

      // Step 1: Update the link's URL and folder
      if (folderId !== newFolderId) {
        // Create a copy of the link with the new URL
        const linkData = {
          ...linksObj[linkId],
          requestUrl: newRequestUrl,
        };

        // Remove from old folder
        const updatedOldFolderLinks = { ...folderData.links };
        delete updatedOldFolderLinks[linkId];

        // Add to new folder
        const newFolderData = foldersData[newFolderId] || {};
        const newFolderLinks = newFolderData.links || {};

        // Update both folders
        const updatedFoldersData = {
          ...foldersData,
          [folderId]: {
            ...folderData,
            links: updatedOldFolderLinks,
          },
          [newFolderId]: {
            ...newFolderData,
            links: {
              ...newFolderLinks,
              [linkId]: linkData,
            },
          },
        };

        await setDoc(foldersDocRef, updatedFoldersData);
      } else {
        // Just update the URL in the same folder
        const updatedLink = {
          ...linksObj[linkId],
          requestUrl: newRequestUrl,
        };

        const updatedLinks = {
          ...folderData.links,
          [linkId]: updatedLink,
        };

        const updatedFoldersData = {
          ...foldersData,
          [folderId]: {
            ...folderData,
            links: updatedLinks,
          },
        };

        await setDoc(foldersDocRef, updatedFoldersData);
      }

      // Step 2: Update tags
      const tagsDocRef = doc(db, "tags", "data");
      const tagsSnapshot = await getDoc(tagsDocRef);
      const existingTags = tagsSnapshot.exists() ? tagsSnapshot.data() : {};

      const updatedTags = { ...existingTags };

      for (const tagName of newTags) {
        const tagId = Object.keys(existingTags).find(
          (key) => existingTags[key].name === tagName
        );

        if (tagId) {
          // Tag already exists, update it
          updatedTags[tagId] = {
            ...existingTags[tagId],
            links: {
              ...existingTags[tagId].links,
              [linkId]: true,
            },
            folders: {
              ...existingTags[tagId].folders,
              [newFolderId]: true,
            },
          };
        } else {
          // Create a new tag with a unique ID
          const newTagId = generateUniqueId();
          updatedTags[newTagId] = {
            name: tagName,
            color: getRandomModernMacOSTagColor(),
            links: { [linkId]: true },
            folders: { [newFolderId]: true },
          };
        }
      }

      await setDoc(tagsDocRef, updatedTags);
    },
    onSuccess: () => {
      toast.success("Link updated successfully!");
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["links", user?.uid, folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["foldersList", user?.uid] });
      queryClient.invalidateQueries({
        queryKey: ["foldersWithLinks", user?.uid],
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error updating link"
      );
    },
  });

  // Handler for deleting a link
  const handleDelete = (linkRequestUrl: string) => {
    deleteMutation.mutate(linkRequestUrl);
  };

  // Handler for editing a link
  const handleEdit = (
    oldLink: Preview,
    newRequestUrl: string,
    newFolderId: string,
    newTags: string[] = []
  ) => {
    editMutation.mutate({ oldLink, newRequestUrl, newFolderId, newTags });
  };

  // Filter links based on searchTerm
  const links = linksQuery.data || [];
  const filteredLinks = links.filter((link) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      link.ogTitle?.toLowerCase().includes(searchLower) ||
      link.ogDescription?.toLowerCase().includes(searchLower) ||
      link.requestUrl.toLowerCase().includes(searchLower)
    );
  });

  const tabs = [
    {
      value: "tab1",
      label: "Basic",
      icon: <ViewBasic className="w-10 h-10 fill-black" />,
      content: (
        <>
          {linksQuery.isPending || linksQuery.isLoading ? (
            <p>Loading links...</p>
          ) : linksQuery.isError ? (
            <p>Error loading links: {(linksQuery.error as Error).message}</p>
          ) : filteredLinks.length > 0 ? (
            <div className="saved-links">
              {filteredLinks.map((link, index) => (
                <BookmarkPreviewBasic
                  key={index}
                  preview={link}
                  currentFolderId={folderId}
                  folders={foldersQuery.data || []}
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
      icon: <ViewCompact className="w-6 h-6 fill-black" />,
      content: (
        <>
          {linksQuery.isPending || linksQuery.isLoading ? (
            <p>Loading links...</p>
          ) : linksQuery.isError ? (
            <p>Error loading links: {(linksQuery.error as Error).message}</p>
          ) : filteredLinks.length > 0 ? (
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
      icon: <ViewDetailed className="w-6 h-6 fill-black" />,
      content: (
        <>
          {linksQuery.isPending || linksQuery.isLoading ? (
            <p>Loading links...</p>
          ) : linksQuery.isError ? (
            <p>Error loading links: {(linksQuery.error as Error).message}</p>
          ) : filteredLinks.length > 0 ? (
            <div className="saved-links grid grid-cols-12 gap-4">
              {filteredLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="col-span-13 lg:col-span-6 xl:col-span-4 mb-5 lg:mb-8"
                >
                  <BookmarkPreviewDetailed key={index} preview={link} />
                </div>
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

// Helper function to generate a unique ID
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}
