import React, { useState } from "react";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAppContext } from "@/context/AppProvider";
import { useFetchFoldersList } from "@/hooks/queries/useFetchFolders";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface EditBookmarkProps {
  preview: Preview;
}

const schema = yup.object().shape({
  url: yup.string().url("Must be a valid URL").required("URL is required"),
  folderId: yup.string().required(),
});

const EditBookmark: React.FC<EditBookmarkProps> = ({ preview }) => {
  const queryClient = useQueryClient();
  const { user } = useAppContext();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Use the basic folders list hook since we don't need links
  const { data: folders = [] } = useFetchFoldersList();

  const folderId = "123";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      url: preview?.requestUrl,
      // folderId: currentFolderId || "",
    },
  });

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

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(preview.requestUrl);
  };

  const onSubmit = (data: { url: string; folderId: string }) => {
    editMutation.mutate({
      oldLink: preview,
      newRequestUrl: data.url,
      newFolderId: data.folderId,
      newTags: tags,
    });
    setDialogOpen(false);
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleOpenDialog}>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Favorite</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete} className="text-red-500">
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>

      {/* Edit Bookmark */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="url" className="text-sm">
                URL
              </label>
              <Input
                id="url"
                type="text"
                placeholder="Enter URL"
                {...register("url")}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="tags" className="text-sm">
                Tags (comma-separated)
              </label>
              <Input
                id="tags"
                type="text"
                placeholder="e.g., work, entertainment"
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((tag) => tag.trim()))
                }
              />
            </div>

            {/* <div className="flex flex-wrap gap-2">
              {preview.tags &&
                Object.keys(preview.tags).map((tagId) => (
                  <span
                    key={tagId}
                    className="bg-gray-200 px-2 py-1 rounded-md text-sm"
                  >
                    {tagId}
                  </span>
                ))}
            </div> */}

            {/* Folder Select */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="folderId" className="text-sm">
                Folder
              </label>
              <select
                id="folderId"
                {...register("folderId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a folder (optional)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              {errors.folderId && (
                <p className="text-sm text-red-500">
                  {errors.folderId.message}
                </p>
              )}
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBookmark;

// Helper function to generate a unique ID
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

// Helper function to get a random modern macOS tag color
function getRandomModernMacOSTagColor() {
  const colors = [
    "#007AFF",
    "#FF2D55",
    "#FF9500",
    "#FF3B30",
    "#FF6B00",
    "#FF9E00",
    "#FFC700",
    "#FFD700",
    "#FFE600",
    "#FFEC8B",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
