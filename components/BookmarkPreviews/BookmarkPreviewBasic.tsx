import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface Folder {
  id: string;
  name: string;
}

interface LinkPreviewBasicProps {
  preview: Preview;
  currentFolderId: string;
  folders: Folder[];
  onDelete: (linkRequestUrl: string) => void;
  onEdit: (
    oldLink: Preview,
    newRequestUrl: string,
    newFolderId: string
  ) => void;
}

const schema = yup.object().shape({
  url: yup.string().url("Must be a valid URL").required("URL is required"),
  folderId: yup.string().required(),
});

const LinkPreviewBasic: React.FC<LinkPreviewBasicProps> = ({
  preview,
  currentFolderId,
  folders,
  onDelete,
  onEdit,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      url: preview.requestUrl,
      folderId: currentFolderId || "",
    },
  });

  const handleOpenDialog = () => {
    reset({
      url: preview.requestUrl,
      folderId: currentFolderId || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = () => {
    onDelete(preview.requestUrl);
  };

  const onSubmit = (data: { url: string; folderId: string }) => {
    onEdit(preview, data.url, data.folderId);
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-2 border border-gray-600 rounded-md">
      <Link
        href={preview.requestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-400 text-lg break-all"
      >
        {preview.requestUrl}
      </Link>

      {/* Dropdown Menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
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
          <DropdownMenuItem
            onSelect={handleDeleteClick}
            className="text-red-500"
          >
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
    </div>
  );
};

export default LinkPreviewBasic;
